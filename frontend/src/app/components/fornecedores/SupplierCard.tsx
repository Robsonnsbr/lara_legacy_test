import { Fornecedor } from "./types";

export default function SupplierCard({ f }: { f: Fornecedor }) {
  return (
    <li className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="font-semibold leading-tight">{f.nome}</div>
        <span className="rounded-full border px-2 py-0.5 text-xs text-gray-600">
          #{f.id}
        </span>
      </div>
      <dl className="mt-2 space-y-1 text-sm text-gray-700">
        <div className="flex gap-2">
          <dt className="w-14 shrink-0 text-gray-500">CNPJ</dt>
          <dd className="break-all">{f.cnpj}</dd>
        </div>
        {f.email && (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-gray-500">Email</dt>
            <dd className="break-all">{f.email}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}
