import { XMarkIcon, XCircleIcon } from '@heroicons/react/24/outline';

const ErrorNotifications = ({ message, onDismiss, showErrors}) => {
  return (
    <div className={`rounded-md bg-red-50 p-4 ${showErrors ? '' : 'hidden'}`}>
      <div className="flex items-center justify-between"> {/* Ajuste la clase para centrar elementos y distribuirlos uniformemente */}
        <div className="flex items-center"> {/* Este div contiene el icono y el mensaje */}
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{message}</p>
          </div>
        </div>
        <div> {/* Este div contiene el botón */}
          <button
            type="button"
            className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotifications;
