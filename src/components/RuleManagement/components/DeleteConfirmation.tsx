import { Button } from "../../Button/Button";
import { Modal } from "../../Modal/Modal";
import type { ManagedRule } from "../types/rule.types";

interface DeleteConfirmationProps {
  rule: ManagedRule | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({ rule, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <Modal open={Boolean(rule)} title="Confirm rule deletion" onClose={onCancel}>
      <div className="pui-stack">
        <p>Delete <strong>{rule?.name}</strong> ({rule?.id})? This action removes the rule from this demo dashboard.</p>
        <div className="pui-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete Rule</Button></div>
      </div>
    </Modal>
  );
}
