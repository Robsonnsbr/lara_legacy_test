<?php


namespace App\Services;


use App\Models\Fornecedor;
use App\Rules\Cnpj;
use Illuminate\Support\Facades\DB;


class FornecedorService
{
    public function create(array $data): Fornecedor
    {
        // Sanitiza CNPJ para somente dígitos
        $data['cnpj'] = Cnpj::onlyDigits($data['cnpj'] ?? '');


        return DB::transaction(function () use ($data) {
            return Fornecedor::create($data);
        });
    }


    /** @return array{items:\Illuminate\Contracts\Pagination\Paginator|\Illuminate\Pagination\LengthAwarePaginator} */
    public function list(?string $nome = null)
    {
        $query = Fornecedor::query();
        if ($nome) {
            $query->where('nome', 'like', "%{$nome}%");
        }
        $items = $query->orderByDesc('id')->paginate(10);
        return compact('items');
    }
}
