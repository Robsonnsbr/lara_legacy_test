"use client";

import { useEffect, useState } from "react";
import SupplierForm from "./components/fornecedores/SupplierForm";
import SupplierList from "./components/fornecedores/SupplierList";
import SearchBar from "./components/fornecedores/SearchBar";
import Alert from "./components/fornecedores/Alert";
import { Fornecedor, MsgType } from "./components/fornecedores/types";

export default function FornecedoresPage() {
  const [itens, setItens] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<MsgType>("info");
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:80";

  async function carregar(nome?: string) {
    setLoading(true);
    try {
      const url = new URL("/api/v1/fornecedores", API_BASE);

      if (nome) url.searchParams.set("nome", nome);
      const r = await fetch(url.toString(), { cache: "no-store" });
      const json = await r.json();
      setItens(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleCreated(okMessage: string) {
    setMsgType("success");
    setMsg(okMessage);
    carregar(q);
  }

  function handleError(errMessage: string) {
    setMsgType("error");
    setMsg(errMessage);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <SupplierForm onCreated={handleCreated} onError={handleError} />

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold sm:text-lg">
              Lista de fornecedores
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm">
              Busque pelo nome e veja os registros cadastrados.
            </p>
          </div>

          <SearchBar value={q} onChange={setQ} onSearch={() => carregar(q)} />
        </div>

        <div className="px-4 py-4 sm:px-6">
          <SupplierList itens={itens} loading={loading} />
          <Alert message={msg} type={msgType} />
        </div>
      </section>
    </div>
  );
}
