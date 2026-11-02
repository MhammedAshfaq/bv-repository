import type { InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  type?: "text" | "email" | "number";
  error?: string;
}

export function Input({ label, type = "text", error, id, ...props }: InputProps) {
  const inputId = id ?? `pui-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <label className="pui-field" htmlFor={inputId}>
      <span className="pui-label">{label}</span>
      <input id={inputId} className="pui-control" type={type} aria-invalid={Boolean(error)} {...props} />
      {error && <span className="pui-error">{error}</span>}
    </label>
  );
}
