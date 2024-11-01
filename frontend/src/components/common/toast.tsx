import { createContext, useContext, useState, ReactNode} from 'react';
import { createPortal } from 'react-dom';
import { RiErrorWarningLine, RiCheckLine } from 'react-icons/ri';

interface ToastMessage {
  id: number;
  message: string;
  icon: ReactNode;
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    const icon =
      type === 'success' ? <RiCheckLine color="green" /> : <RiErrorWarningLine color="red" />;

    setToasts((prev) => [...prev, { id, message, icon }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-white text-gray-800 p-4 shadow-md rounded-md flex items-center"
            >
              <div className="mr-2">{toast.icon}</div>
              <div>{toast.message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
