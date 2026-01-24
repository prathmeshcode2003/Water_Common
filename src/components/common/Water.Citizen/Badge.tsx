export function Badge({
  variant = "info",
  children,
}: {
  variant?: "info" | "success" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    variant === "success"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : variant === "danger"
      ? "bg-rose-100 text-rose-800 border-rose-200"
      : "bg-blue-100 text-blue-800 border-blue-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${cls}`}>
      {children}
    </span>
  );
}
