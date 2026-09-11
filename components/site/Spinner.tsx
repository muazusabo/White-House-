export default function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span aria-hidden="true" className="spinner" />
      <span>{label}</span>
    </span>
  );
}
