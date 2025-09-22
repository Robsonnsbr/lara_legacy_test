<?php


namespace App\Http\Requests;


use App\Rules\Cnpj;
use Illuminate\Foundation\Http\FormRequest;


class StoreFornecedorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'cnpj' => ['required', new Cnpj, 'unique:fornecedores,cnpj'],
            'email' => ['nullable', 'email', 'max:255'],
        ];
    }


    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'cnpj.required' => 'O CNPJ é obrigatório.',
            'cnpj.unique' => 'Já existe fornecedor com este CNPJ.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('cnpj')) {
            $this->merge([
                'cnpj' => Cnpj::onlyDigits($this->input('cnpj'))
            ]);
        }
    }
}
