import React from "react";
import ReactMarkdown from "react-markdown";

export function Dialog({ open, onClose, children }) {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    // Close only if clicked directly on the overlay, not inside dialog content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 overflow-y-auto max-h-[70vh]">{children}</div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export function DialogTrigger({ children, onClick }) {
  return React.cloneElement(children, { onClick });
}

export function DialogContent({ children }) {
  return children;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-bold mb-2">{children}</h2>;
}

export function DialogMarkdown({ content }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
