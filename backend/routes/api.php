<?php

use App\Http\Controllers\Api\FornecedorController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/fornecedores')->group(function () {
    Route::get('/', [FornecedorController::class, 'index']);
    Route::post('/', [FornecedorController::class, 'store']);
});
