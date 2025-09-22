#!/usr/bin/env bash
set -euo pipefail

log() { echo -e "$1"; }

log "==> [1/13] Verificando Docker Compose..."
docker compose version >/dev/null

log "==> [2/13] Garantindo .env do backend..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  log "    - backend/.env criado a partir do .env.example"
else
  log "    - backend/.env já existe"
fi

log "==> [3/13] Garantindo .env.testing do backend (para tests)..."
if [ ! -f backend/.env.testing ]; then
  cat > backend/.env.testing <<'EOF'
APP_NAME=Laravel
APP_ENV=testing
APP_KEY=base64:dummyKeyForTestsOnly000000000000000000000000000=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
DB_DATABASE=:memory:

LOG_CHANNEL=stderr
LOG_LEVEL=warning

CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
MAIL_MAILER=array

SANCTUM_STATEFUL_DOMAINS=localhost:3000
EOF
  log "    - backend/.env.testing criado"
else
  log "    - backend/.env.testing já existe"
fi

log "==> [4/13] Garantindo .env do frontend..."
if [ ! -f frontend/.env.local ]; then
  if [ -f frontend/.env.example ]; then
    cp frontend/.env.example frontend/.env.local
    log "    - frontend/.env.local criado a partir do .env.example"
  else
    log "    - aviso: frontend/.env.example não encontrado; criando frontend/.env.local vazio"
    touch frontend/.env.local
  fi
else
  log "    - frontend/.env.local já existe"
fi

log "==> [5/13] Subindo containers (build se necessário)..."
docker compose up -d --build

log "==> [6/13] Aguardando MySQL ficar saudável..."
MYSQL_CID="$(docker compose ps -q mysql || true)"
if [ -z "$MYSQL_CID" ]; then
  log "    !! Não encontrei o container do mysql. Verifique o service name no compose."
  docker compose ps
  exit 1
fi

ATTEMPTS=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' "$MYSQL_CID" 2>/dev/null || echo starting)" = "healthy" ]; do
  ATTEMPTS=$((ATTEMPTS+1))
  if [ $ATTEMPTS -gt 90 ]; then
    log "    !! MySQL não ficou saudável em tempo hábil. Últimos logs:"
    docker compose logs --tail=200 mysql
    exit 1
  fi
  sleep 2
done
log "    - MySQL OK"

log "==> [7/13] Instalando dependências do backend (composer)..."
docker compose exec -T -w /var/www/html backend composer install --no-interaction --prefer-dist

log "==> [8/13] Fixando permissões de storage/bootstrap..."
docker compose exec -T -w /var/www/html backend sh -lc '
  mkdir -p storage/logs bootstrap/cache &&
  touch storage/logs/laravel.log &&
  chown -R www-data:www-data storage bootstrap/cache &&
  chmod -R ug+rwX storage bootstrap/cache
'

log "==> [9/13] Gerando APP_KEY (se necessário)..."
if ! docker compose exec -T -w /var/www/html backend sh -lc "grep -q '^APP_KEY=base64:' .env"; then
  docker compose exec -T -w /var/www/html backend php artisan key:generate
  log "    - APP_KEY gerado"
else
  log "    - APP_KEY já definido"
fi

log "==> [10/13] Rodando migrations + seeds (ambiente dev: MySQL)..."
if ! docker compose exec -T -w /var/www/html backend php artisan migrate:fresh --seed --no-interaction; then
  log "    !! Falha ao migrar/seedar. Logs do backend (finais):"
  docker compose logs --tail=200 backend
  exit 1
fi

log "==> [11/13] Rodando testes do backend (.env.testing forçado)..."
docker compose exec \
  -e APP_ENV=testing \
  -e DB_CONNECTION=sqlite \
  -e DB_DATABASE=":memory:" \
  -e TERM=xterm-256color \
  -e FORCE_COLOR=1 \
  -w /var/www/html backend sh -lc '
    php artisan config:clear
    echo "    - Conferindo conexão antes do teste"
    php -r "require \"vendor/autoload.php\"; \$app=require \"bootstrap/app.php\"; \$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); echo \"DB_CONNECTION=\".config(\"database.default\").PHP_EOL; echo \"DB_DATABASE=\".config(\"database.connections.\".config(\"database.default\").\".database\").PHP_EOL;"
    php artisan test --env=testing --ansi
  '

log "==> [12/13] Instalando dependências do frontend (npm)..."
docker compose exec -T -w /usr/src/app frontend npm install

log "==> [13/13] Iniciando frontend em modo dev..."
docker compose exec -d -w /usr/src/app frontend sh -lc "npm run dev -- -H 0.0.0.0 -p 3000"

log ""
log "Projeto pronto."
log "Backend (Laravel API): http://localhost/api/vagas  |  http://localhost/api/candidatos"
log "Frontend (Next.js):    http://localhost:3000"
log ""
log "Logs do frontend: docker compose logs -f frontend"
log "Logs do backend:  docker compose logs -f backend"
log "Re-rodar testes:  docker compose exec backend php artisan test"
log "Re-seedar dev:    docker compose exec backend php artisan migrate:fresh --seed --no-interaction"
