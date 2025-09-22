export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-gray-400 border-b-transparent"
    />
  );
}
