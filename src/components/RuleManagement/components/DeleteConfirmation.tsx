import { Button } from "../../Button/Button";
import { Modal } from "../../Modal/Modal";

interface DeleteConfirmationProps {
  item: { id: string; name: string } | undefined;
  itemType: "rule" | "list";
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ item, itemType, onConfirm, onCancel }: DeleteConfirmationProps) {
  const label = itemType === "rule" ? "rule" : "list";
  return (
    <Modal open={Boolean(item)} title={`Confirm ${label} deletion`} onClose={onCancel}>
      <div className="pui-stack">
        <p>Delete this {label}: <strong>{item?.name}</strong> ({item?.id})? This removes it from the demo dashboard.</p>
        <div className="pui-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete {itemType === "rule" ? "Rule" : "List"}</Button></div>
      </div>
    </Modal>
  );
}
