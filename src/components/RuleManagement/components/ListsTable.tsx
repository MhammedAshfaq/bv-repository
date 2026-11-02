import type { ManagedList } from "../types/list.types";

interface ListsTableProps {
  lists: ManagedList[];
}

export function ListsTable({ lists }: ListsTableProps) {
  return (
    <div className="pui-table-wrap">
      <table className="pui-table">
        <thead><tr><th>List</th><th>Description</th><th>Type</th><th>Items</th></tr></thead>
        <tbody>
          {lists.map((list) => <tr key={list.id}>
            <td><strong>{list.name}</strong><small>{list.id}</small></td>
            <td>{list.description}</td><td>{list.type}</td><td>{list.items.length}</td>
          </tr>)}
          {lists.length === 0 && <tr><td colSpan={4} className="pui-empty">No lists created yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
