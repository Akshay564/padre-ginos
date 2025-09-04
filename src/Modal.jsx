import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function Modal({ children, onClose }) {
  const modalRoot = document.getElementById("modal");

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div className="modal-content">{children}</div>
    </div>,
    modalRoot,
  );
}
