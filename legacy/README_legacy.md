# Código Legado — Fornecedores

Este arquivo (`fornecedor_legacy.php`) representa a implementação **LEGADA** em PHP 7.4 procedural, utilizada como base para o processo de migração neste teste técnico.

## Características do legado

- Uso de `mysqli` direto (sem PDO, sem ORM).
- Código procedural, sem camadas.
- SQL inline sem _prepared statements_ (vulnerável a SQL Injection).
- Validações mínimas apenas em `nome` e `cnpj`.
- Endpoint único que responde a:
  - `action=create` → cria fornecedor.
  - default → lista fornecedores com filtro opcional `q`.

## Estrutura da tabela no legado

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
