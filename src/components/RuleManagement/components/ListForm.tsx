import { useEffect, useState } from "react";
import { Button } from "../../Button/Button";
import { Dropdown } from "../../Dropdown/Dropdown";
import { Input } from "../../Input/Input";
import type { ManagedList, ListType } from "../types/list.types";

interface ListFormProps {
  action: "create" | "update";
  list?: ManagedList;
  onSubmit: (list: Omit<ManagedList, "id">) => void;
  onCancel: () => void;
}

export function ListForm({ action, list, onSubmit, onCancel }: ListFormProps) {
  const [name, setName] = useState(list?.name ?? "");
  const [description, setDescription] = useState(list?.description ?? "");
  const [type, setType] = useState<ListType>(list?.type ?? "Allow List");
  const [items, setItems] = useState(list?.items.length ? list.items : [""]);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(list?.name ?? "");
    setDescription(list?.description ?? "");
    setType(list?.type ?? "Allow List");
    setItems(list?.items.length ? list.items : [""]);
  }, [list]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanItems = items.map((item) => item.trim()).filter(Boolean);
    if (!name.trim() || !description.trim() || cleanItems.length === 0) {
      setError("Enter a list name, description, and at least one list item.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), description: description.trim(), type, items: cleanItems });
  }

  return (
    <form className="pui-form" onSubmit={submit}>
      <div className="pui-form-grid">
        <Input label="List Name" required value={name} onChange={(event) => setName(event.target.value)} />
        <Input label="List Description" required value={description} onChange={(event) => setDescription(event.target.value)} />
        <Dropdown label="List Type" value={type} onChange={(event) => setType(event.target.value as ListType)}
          options={[{ label: "Allow List", value: "Allow List" }, { label: "Block List", value: "Block List" }]} />
      </div>
      <div className="pui-section-heading"><h3>List items</h3>
        <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, ""])}>Add Item</Button>
      </div>
      {items.map((item, index) => <div className="pui-condition pui-list-item" key={index}>
        <Input label={`Item ${index + 1}`} required value={item} onChange={(event) => setItems((current) => current.map((value, i) => i === index ? event.target.value : value))} />
        <Button type="button" variant="danger" disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, i) => i !== index))}>Remove Item</Button>
      </div>)}
      {error && <p className="pui-error" role="alert">{error}</p>}
      <div className="pui-actions"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">{action === "create" ? "Save List" : "Update List"}</Button></div>
    </form>
  );
}
