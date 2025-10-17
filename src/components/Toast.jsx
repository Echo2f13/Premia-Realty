import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-md">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-accent" strokeWidth={1.5} />,
    error: <XCircle className="w-5 h-5 text-destructive" strokeWidth={1.5} />,
    info: <Info className="w-5 h-5 text-accent" strokeWidth={1.5} />,
  };

  const bgColors = {
    success: 'bg-card border-accent/30',
    error: 'bg-card border-destructive/30',
    info: 'bg-card border-accent/30',
  };

  return (
    <div
      className={`${bgColors[type]} border backdrop-blur-md p-4 shadow-lg animate-fade-in-right flex items-start gap-3 min-w-[300px]`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm text-foreground font-light">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-foreground/40 hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default Toast;
