type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
};
export default function SearchBar({ value, onChange, onSearch }: Props) {
  return (
    <div className="flex w-full gap-2 sm:w-auto">
      <input
        placeholder="Filtrar por nome"
        className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 sm:w-64"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtro por nome"
      />
      <button
        className="rounded-xl border px-4 py-2 transition hover:bg-gray-50"
        onClick={onSearch}
      >
        Buscar
      </button>
    </div>
  );
}
