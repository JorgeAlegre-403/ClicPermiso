import { useToastStore } from '../../stores/toastStore';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const iconMap = {
  success: <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />,
  error: <FiXCircle className="text-red-400 text-xl flex-shrink-0" />,
  info: <FiInfo className="text-blue-400 text-xl flex-shrink-0" />,
  warning: <FiAlertTriangle className="text-amber-400 text-xl flex-shrink-0" />,
};

const bgMap = {
  success: 'bg-emerald-50 border-emerald-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-amber-50 border-amber-200',
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-[slideIn_0.3s_ease] ${bgMap[toast.type]}`}
        >
          {iconMap[toast.type]}
          <span className="text-sm text-slate-700 flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
