<?php


namespace Database\Seeders;


use App\Models\Fornecedor;
use Illuminate\Database\Seeder;


class FornecedorSeeder extends Seeder
{
    public function run(): void
    {
        $dados = [
            ['nome' => 'Fornecedor Alpha', 'cnpj' => '11222333000181', 'email' => 'alpha@exemplo.com'],
            ['nome' => 'Fornecedor Beta', 'cnpj' => '33444555000130', 'email' => 'beta@exemplo.com'],
        ];
        foreach ($dados as $d) {
            Fornecedor::create($d);
        }
    }
}
