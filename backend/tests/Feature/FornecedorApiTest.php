<?php


namespace Tests\Feature;


use App\Models\Fornecedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class FornecedorApiTest extends TestCase
{
    use RefreshDatabase;


    public function test_store_sucesso(): void
    {
        $payload = [
            'nome' => 'ACME Ltda',
            'cnpj' => '12.345.678/0001-95', // com máscara
            'email' => 'contato@acme.com',
        ];


        $res = $this->postJson('/api/v1/fornecedores', $payload);
        $res->assertCreated()
            ->assertJsonPath('data.nome', 'ACME Ltda')
            ->assertJsonPath('data.cnpj', '12345678000195');


        $this->assertDatabaseHas('fornecedores', [
            'cnpj' => '12345678000195',
        ]);
    }


    public function test_store_falha_validacao(): void
    {
        $payload = [
            'nome' => '',
            'cnpj' => '11111111111111', // inválido
        ];
        $res = $this->postJson('/api/v1/fornecedores', $payload);
        $res->assertStatus(422)
            ->assertJsonValidationErrors(['nome', 'cnpj']);
    }


    public function test_index_com_filtro_nome(): void
    {
        Fornecedor::factory()->create(['nome' => 'Floripa Peças', 'cnpj' => '11222333000181']);
        Fornecedor::factory()->create(['nome' => 'Curitiba Peças', 'cnpj' => '33444555000130']);


        $res = $this->getJson('/api/v1/fornecedores?nome=Curitiba');
        $res->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nome', 'Curitiba Peças');
    }
}
