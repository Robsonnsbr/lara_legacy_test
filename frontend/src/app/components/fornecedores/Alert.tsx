type Props = {
  message: string | null;
  type?: "success" | "error" | "info";
  className?: string;
};
export default function Alert({ message, type = "info", className }: Props) {
  if (!message) return null;
  const base = "mt-3 rounded-xl px-3 py-2 text-sm border ";
  const style =
    type === "success"
      ? "bg-green-50 text-green-700 border-green-200"
      : type === "error"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return <p className={`${base}${style} ${className ?? ""}`}>{message}</p>;
}
