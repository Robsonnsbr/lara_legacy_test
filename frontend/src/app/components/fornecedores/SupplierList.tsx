import Spinner from "./Spinner";
import SupplierCard from "./SupplierCard";
import { Fornecedor } from "./types";

type Props = {
  itens: Fornecedor[];
  loading: boolean;
};
export default function SupplierList({ itens, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Spinner />
        Carregando...
      </div>
    );
  }
  if (itens.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-gray-500">
        Nenhum resultado. Tente outro filtro ou cadastre um fornecedor.
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((f) => (
        <SupplierCard key={f.id} f={f} />
      ))}
    </ul>
  );
}
