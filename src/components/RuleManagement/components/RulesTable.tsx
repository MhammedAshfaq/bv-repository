import { Button } from "../../Button/Button";
import type { ManagedRule } from "../types/rule.types";

interface RulesTableProps {
  rules: ManagedRule[];
  onEdit: (rule: ManagedRule) => void;
  onDelete: (rule: ManagedRule) => void;
}

export function RulesTable({ rules, onEdit, onDelete }: RulesTableProps) {
  return (
    <div className="pui-table-wrap">
      <table className="pui-table">
        <thead><tr><th>Rule</th><th>Description</th><th>Type</th><th>Status</th><th>Rule action</th><th>Conditions</th><th>Manage</th></tr></thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td><strong>{rule.name}</strong><small>{rule.id}</small></td>
              <td>{rule.description}</td><td>{rule.type}</td>
              <td><span className={`pui-badge pui-badge--${rule.status.toLowerCase()}`}>{rule.status}</span></td>
              <td>{rule.action}</td><td>{rule.conditions.length}</td>
              <td><div className="pui-row-actions">
                <Button variant="secondary" onClick={() => onEdit(rule)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(rule)}>Delete</Button>
              </div></td>
            </tr>
          ))}
          {rules.length === 0 && <tr><td colSpan={7} className="pui-empty">No rules match your search.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
