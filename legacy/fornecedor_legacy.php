<?php

/**
 * fornecedor_legacy.php
 * 
 * Código LEGADO (PHP 7.4 procedural) usado apenas como referência no teste.
 * Observação: contém práticas inseguras (SQL inline, validação mínima, etc.)
 * e NÃO deve ser usado em produção. Serve só para comparar com a migração Laravel.
 *
 * Estrutura de tabela LEGADA (referência):
 *
 * CREATE TABLE fornecedores (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   nome VARCHAR(255) NOT NULL,
 *   cnpj VARCHAR(14) NOT NULL,
 *   email VARCHAR(255) NULL,
 *   criado_em DATETIME NOT NULL
 * );
 * CREATE UNIQUE INDEX ux_fornecedores_cnpj ON fornecedores(cnpj);
 */

$mysqli = new mysqli("localhost", "root", "", "legacy_db");
if ($mysqli->connect_error) {
    die("erro db");
}

$action = $_GET['action'] ?? 'list';

function onlyDigits($s)
{
    return preg_replace('/\D+/', '', $s);
}

if ($action === 'create') {
    $nome  = $_POST['nome']  ?? '';
    $cnpj  = onlyDigits($_POST['cnpj'] ?? '');
    $email = $_POST['email'] ?? '';

    if (strlen($nome) < 3)  die("nome curto");
    if (strlen($cnpj) != 14) die("cnpj invalido");

    // Atenção: SQL abaixo é o LEGADO propositalmente sem prepared statements
    $sql = "INSERT INTO fornecedores (nome, cnpj, email, criado_em)
            VALUES ('$nome', '$cnpj', '$email', NOW())";

    if (!$mysqli->query($sql)) {
        die("erro insert: " . $mysqli->error);
    }

    echo "ok";
} else {
    $q = $_GET['q'] ?? '';

    // Busca simples com LIKE no nome (LEGADO)
    $sql = "SELECT id, nome, cnpj, email, criado_em
            FROM fornecedores
            WHERE nome LIKE '%$q%'
            ORDER BY criado_em DESC
            LIMIT 50";

    $res = $mysqli->query($sql);
    $data = [];

    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $data[] = $row;
        }
    }

    header('Content-Type: application/json');
    echo json_encode($data);
}
