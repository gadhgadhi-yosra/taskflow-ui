export function AuthButton({
  children,
  type = "button",
  variant = "primary", 
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "w-full py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition";

  const primary =
    "shadow-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 bg-[length:200%_100%] hover:bg-[position:100%_0] disabled:opacity-60 disabled:cursor-not-allowed";

  const muted =
    "shadow-lg bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed";


  const social =
    "shadow-none bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-sm";

  const styles =
    variant === "primary"
      ? primary
      : variant === "muted"
      ? muted
      : social;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
