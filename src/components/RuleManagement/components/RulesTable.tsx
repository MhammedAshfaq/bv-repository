import type { ManagedRule } from "../types/rule.types";

interface RulesTableProps {
  rules: ManagedRule[];
}

export function RulesTable({ rules }: RulesTableProps) {
  return (
    <div className="pui-table-wrap">
      <table className="pui-table">
        <thead><tr><th>Rule</th><th>Description</th><th>Type</th><th>Status</th><th>Action</th><th>Conditions</th></tr></thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td><strong>{rule.name}</strong><small>{rule.id}</small></td>
              <td>{rule.description}</td><td>{rule.type}</td>
              <td><span className={`pui-badge pui-badge--${rule.status.toLowerCase()}`}>{rule.status}</span></td>
              <td>{rule.action}</td><td>{rule.conditions.length}</td>
            </tr>
          ))}
          {rules.length === 0 && <tr><td colSpan={6} className="pui-empty">No rules match your search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
