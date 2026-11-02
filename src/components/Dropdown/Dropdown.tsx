import type { SelectHTMLAttributes } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: DropdownOption[];
}

export function Dropdown({ label, options, id, ...props }: DropdownProps) {
  const selectId = id ?? `pui-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className="pui-field" htmlFor={selectId}>
      <span className="pui-label">{label}</span>
      <select id={selectId} className="pui-control" {...props}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
