# Teste Técnico – Migração PHP Nativo → Laravel + Next.js

Este projeto implementa a migração de um código legado em PHP 7.4 procedural (`legacy/fornecedor_legacy.php`) para uma API moderna em **Laravel 12**, com frontend em **Next.js 14**.

O escopo segue o que foi solicitado no desafio: migração, boas práticas, arquitetura em camadas e entrega de uma API funcional com frontend simples para consumir os endpoints.

---

## O que foi solicitado

- Criar **migration** e **model** `Fornecedor` com `created_at`, `updated_at` e soft deletes.
- Criar **FormRequest** para validações.
- Implementar **endpoints REST**:
  - `POST /api/v1/fornecedores`
  - `GET /api/v1/fornecedores?nome=...` (filtro por nome).
- Adotar **Service Layer** (sanitização de CNPJ, uso de transações).
- Usar **Resource** para formatação das respostas JSON.
- Implementar **testes Feature**:
  - Sucesso na criação.
  - Falha de validação.
  - Busca filtrada.
- Elaborar um **plano de migração** (1 página).
- Incluir **README** com instruções de execução.

---

## O que foi entregue

- [x] Migration `fornecedores` com timestamps e soft deletes.
- [x] Model `Fornecedor`.
- [x] FormRequest `StoreFornecedorRequest` com regras e mensagens customizadas.
- [x] Service `FornecedorService` para regras de negócio e transações.
- [x] Resource `FornecedorResource`.
- [x] Controller `FornecedorController` com métodos `index` e `store`.
- [x] Rotas `api.php` versionadas (`/api/v1/fornecedores`).
- [x] Testes Feature cobrindo cenários de sucesso, falha de validação e busca.
- [x] Plano de migração em `docs/PLANO_MIGRACAO.md`.
- [x] Frontend em Next.js:
  - Formulário com validação client-side (Zod).
  - Filtro por nome.
  - Layout responsivo em TailwindCSS.
- [x] Setup automatizado (`setup.sh`) para subir containers, rodar migrations, seeds e testes.

---

## Tecnologias utilizadas

### Backend

- [Laravel 12](https://laravel.com) (PSR-12, Eloquent, FormRequests, Resources, Services).
- PHP 8.3 (via container).
- MySQL 8.4.
- PHPUnit para testes.

### Frontend

- [Next.js 14](https://nextjs.org/) com App Router.
- React 18.
- TailwindCSS.
- [Zod](https://zod.dev) para validação.

### Infraestrutura

- Docker Compose (MySQL, Laravel, Next.js, Nginx).
- Script `setup.sh` para automação de ambiente.

---

## Como executar

### Pré-requisitos

- Docker e Docker Compose instalados na máquina.

### Passos iniciais

1. Clonar o repositório:

   ```bash
   git clone https://github.com/Robsonnsbr/lara_legacy_test.git
   ```

2. Entrar na pasta do projeto:
   ```bash
   cd lara_legacy_test
   ```

### 1. Usando o script `setup.sh` (recomendado)

```bash
./setup.sh
```

Este comando:

- Verifica Docker Compose.
- Gera `.env` do backend e `.env.local` do frontend.
- Sobe os containers.
- Aguarda MySQL ficar saudável.
- Instala dependências (Composer e npm).
- Gera `APP_KEY`.
- Roda migrations + seeds.
- Executa os testes automatizados.
- Inicia o frontend em modo dev.

Acesse:

- Backend API: [http://localhost/api/v1/fornecedores](http://localhost/api/v1/fornecedores)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

### 2. Manualmente (sem `setup.sh`)

1. Subir containers:

   ```bash
   docker compose up -d --build
   ```

2. Backend:

   ```bash
   docker compose exec backend composer install
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate --seed
   docker compose exec backend php artisan test
   ```

3. Frontend:
   ```bash
   docker compose exec frontend npm install
   docker compose exec -d frontend npm run dev -- -H 0.0.0.0 -p 3000
   ```

---

## Plano de migração

O plano resumido está em [`legacy/README_legacy.md`](legacy/README_legacy.md).  
Ele descreve:

- Estratégia incremental (rodar Laravel em paralelo ao legado).
- Estrutura de dados e validações migradas.
- Como manter consistência (índices, chaves únicas, CNPJ).
- Cronograma proposto para desligar o legado.
