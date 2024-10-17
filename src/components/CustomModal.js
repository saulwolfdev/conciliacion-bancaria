import React from 'react';

const CustomModal = ({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  showCancelButton = false, 
  showConfirmButton = false, 
  cancelButtonText = 'Cancelar', 
  confirmButtonText = 'Confirmar', 
  onCancel, 
  onConfirm, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className={`bg-white rounded-lg shadow-md p-6 relative z-10 ${sizeClasses[size]} w-full`}>
        <button 
          onClick={onClose} 
          className="absolute top-3 right-6 text-gray-600 hover:text-gray-900 text-3xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{content}</div>
        <div className="flex justify-end mt-4 space-x-2">
          {showCancelButton && (
            <button 
              onClick={onCancel || onClose} 
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              {cancelButtonText}
            </button>
          )}
          {showConfirmButton && (
            <button 
              onClick={onConfirm || onClose} 
              className="px-4 py-2 bg-customGreen text-white rounded"
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
