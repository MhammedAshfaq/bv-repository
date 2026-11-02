import { useEffect, type ReactNode } from "react";
import { Button } from "../Button/Button";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pui-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="pui-modal" role="dialog" aria-modal="true" aria-labelledby="pui-modal-title">
        <header className="pui-modal__header">
          <h2 id="pui-modal-title">{title}</h2>
          <Button variant="secondary" aria-label="Close dialog" onClick={onClose}>Close</Button>
        </header>
        {children}
      </section>
    </div>
  );
}
