<?php


namespace App\Rules;


use Closure;
use Illuminate\Contracts\Validation\ValidationRule;


class Cnpj implements ValidationRule
{
    public static function onlyDigits(string $value): string
    {
        return preg_replace('/\D+/', '', $value) ?? '';
    }


    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $cnpj = self::onlyDigits((string)$value);


        if (strlen($cnpj) !== 14) {
            $fail('O CNPJ deve conter 14 dígitos.');
            return;
        }


        // Rejeita repetidos
        if (preg_match('/^(\d)\1{13}$/', $cnpj)) {
            $fail('CNPJ inválido.');
            return;
        }


        // Validação dos dígitos verificadores
        $calc = function (array $nums, array $peso) {
            $s = 0;
            foreach ($nums as $i => $n) {
                $s += $n * $peso[$i];
            }
            return ($s % 11) < 2 ? 0 : 11 - ($s % 11);
        };


        $nums = array_map('intval', str_split($cnpj));
        $dv1 = $calc(array_slice($nums, 0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        $dv2 = $calc(array_slice($nums, 0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        if ($dv1 !== $nums[12] || $dv2 !== $nums[13]) {
            $fail('CNPJ inválido.');
            return;
        }
    }
}
