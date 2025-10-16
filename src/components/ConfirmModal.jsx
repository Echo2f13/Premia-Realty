import { X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'success'
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    primary: 'bg-gradient-gold',
    success: 'bg-green-500 hover:bg-green-600',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
      <div className="glass-card p-8 max-w-md w-full mx-4">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-platinum-pearl">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-platinum-pearl/50 hover:text-platinum-pearl transition"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-platinum-pearl/70 mb-6">{message}</div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg transition ${variantStyles[confirmVariant]} disabled:opacity-50`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
