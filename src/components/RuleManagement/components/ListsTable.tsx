import { Button } from "../../Button/Button";
import type { ManagedList } from "../types/list.types";

interface ListsTableProps {
  lists: ManagedList[];
  onEdit: (list: ManagedList) => void;
  onDelete: (list: ManagedList) => void;
}

export function ListsTable({ lists, onEdit, onDelete }: ListsTableProps) {
  return (
    <div className="pui-table-wrap">
      <table className="pui-table">
        <thead><tr><th>List</th><th>Description</th><th>Type</th><th>Items</th><th>Manage</th></tr></thead>
        <tbody>
          {lists.map((list) => <tr key={list.id}>
            <td><strong>{list.name}</strong><small>{list.id}</small></td>
            <td>{list.description}</td><td>{list.type}</td><td>{list.items.length}</td>
            <td><div className="pui-row-actions">
              <Button variant="secondary" onClick={() => onEdit(list)}>Edit</Button>
              <Button variant="danger" onClick={() => onDelete(list)}>Delete</Button>
            </div></td>
          </tr>)}
          {lists.length === 0 && <tr><td colSpan={5} className="pui-empty">No lists created yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
