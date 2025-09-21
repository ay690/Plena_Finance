import React from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    containerRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, closeOnEsc]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (closeOnBackdrop) onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Container */}
          <motion.div
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
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#2a2a2e" }}>
                <div className="text-zinc-100 text-sm font-medium flex-1 truncate">
                  {title}
                </div>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
;

export default ModalSection;

