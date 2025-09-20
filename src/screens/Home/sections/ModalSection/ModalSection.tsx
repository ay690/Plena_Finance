import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number | string;
  className?: string;
  contentClassName?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
};

 
export const ModalSection: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 640, 
  className = "",
  contentClassName = "",
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = false,
}) => {
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    containerRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
   
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => {
          if (closeOnBackdrop) onClose();
        }}
      />

      <div
        ref={containerRef}
        tabIndex={-1}
        className={`relative z-10 w-full mx-3 sm:mx-4 rounded-lg sm:rounded-xl border shadow-xl outline-none ${className}`}
        style={{
          maxWidth,
          background: "#1f1f22",
          borderColor: "#2a2a2e",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#2a2a2e" }}>
            <div className="text-zinc-100 text-sm font-medium flex-1 truncate">
              {title}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#2a2a2e] focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`max-h-[75vh] sm:max-h-[70vh] overflow-y-auto px-4 py-3 ${contentClassName}`}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-t flex items-center justify-end" style={{ borderColor: "#2a2a2e" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalSection;

