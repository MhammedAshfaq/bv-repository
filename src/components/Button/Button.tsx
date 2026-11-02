import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  label?: string;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  label,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`pui-button pui-button--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? "Saving…" : children ?? label}
    </button>
  );
}
