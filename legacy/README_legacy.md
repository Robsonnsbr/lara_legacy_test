# README_legacy – Código Legado e Plano de Migração

## Código legado

O sistema original era em **PHP 7.4 procedural**, com um arquivo único `fornecedor_legacy.php` e a tabela:

```sql
CREATE TABLE fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL,
  email VARCHAR(255) NULL,
  criado_em DATETIME NOT NULL
);
CREATE UNIQUE INDEX ux_fornecedores_cnpj ON fornecedores(cnpj);
```

### Problemas do legado

- Arquitetura procedural, sem separação de camadas.
- Ausência de validação robusta de dados.
- Falta de sanitização de CNPJ.
- Campos manuais (`criado_em`) em vez de timestamps automáticos.
- Nenhum suporte a soft deletes.
- Sem testes automatizados.

---

## Plano de Migração

### Objetivo

Migrar para **Laravel 12** seguindo arquitetura limpa, PSR-12 e boas práticas.

### Estratégia

1. **Infraestrutura**: usar Docker Compose com MySQL, Laravel, (_Nginx e Next.js_ Não obrigatório!).
2. **Dados**: recriar tabela `fornecedores` com `created_at`, `updated_at`, `deleted_at` e índice único para `cnpj`.
3. **Validações**: aplicar validações no backend (FormRequest + regra customizada de CNPJ) e frontend (Zod).
4. **API**: expor endpoints REST (`/api/v1/fornecedores`) com padrão Laravel.
5. **Service Layer**: encapsular regras de negócio (sanitização de CNPJ, uso de transações).
6. **Frontend**: fornecer formulário e lista responsiva para CRUD básico.
7. **Testes**: implementar testes Feature cobrindo sucesso, falha de validação e busca filtrada.
8. **Estratégia incremental**: rodar Laravel em paralelo ao legado; migrar gradualmente os fluxos até desligar o PHP procedural.

### Resultado esperado

- API moderna, segura e validada.
- Frontend simples e responsivo para consumo da API.
- Cobertura mínima de testes automatizados.
- Plano claro para desligamento do legado.
