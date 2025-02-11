import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SuccessNotification = ({ message, onDismiss, showSuccess}) => {
  return (
    <div className={`rounded-md bg-green-50 p-4 ${showSuccess ? '' : 'hidden'}`}>
      <div className="flex items-center justify-between"> {/* Ajuste la clase para centrar elementos y distribuirlos uniformemente */}
        <div className="flex items-center"> {/* Este div contiene el icono y el mensaje */}
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
        </div>
        <div> {/* Este div contiene el botón */}
          <button
            type="button"
            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
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

export default SuccessNotification;
