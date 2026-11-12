import React, { useEffect } from 'react';

interface ConfirmDialogProps {
  isDarkMode: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isDarkMode,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const t = isDarkMode
    ? {
        panel: 'bg-[#172033] border-[#2C3A56] text-[#E8ECF4]',
        muted: 'text-[#8B96AB]',
        ghost: 'text-[#8B96AB] hover:text-[#E8ECF4]',
      }
    : {
        panel: 'bg-white border-[#D7DEE8] text-[#14213D]',
        muted: 'text-[#5B6578]',
        ghost: 'text-[#5B6578] hover:text-[#14213D]',
      };

  const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2A900]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101826]/70 p-4"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
      onClick={onCancel}
    >
      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        .dialog-in { animation: dialogIn 0.2s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .dialog-in { animation: none; } }
      `}</style>

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className={`dialog-in w-full max-w-sm border p-6 ${t.panel}`}
        style={{ borderRadius: '26px 22px 28px 24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p id="confirm-message" dir="auto" className={`mt-2 text-sm ${t.muted}`}>
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium ${t.ghost} ${focus}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl bg-[#F07878] px-4 py-2.5 text-sm font-semibold text-[#101826] transition-colors hover:bg-[#F58E8E] ${focus}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};