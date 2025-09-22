<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFornecedorRequest;
use App\Http\Resources\FornecedorResource;
use App\Services\FornecedorService;
use Illuminate\Http\Request;

class FornecedorController extends Controller
{
    public function __construct(private FornecedorService $service) {}

    public function index(Request $request)
    {
        $nome = $request->query('nome');
        $result = $this->service->list($nome);
        return FornecedorResource::collection($result['items']);
    }

    public function store(StoreFornecedorRequest $request)
    {
        $fornecedor = $this->service->create($request->validated());
        return (new FornecedorResource($fornecedor))
            ->response()
            ->setStatusCode(201);
    }
}
