'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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
  size = 'md',
  showIcon = false 
}) =>{

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
    <Dialog  open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className={`relative z-10 bg-white rounded-lg shadow-md p-6 transition-all transform data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full ${sizeClasses[size]}`}
          >           
            <button 
              onClick={onClose} 
              className="absolute top-3 right-6 text-gray-600 hover:text-gray-900 text-3xl"
            >
              &times;
            </button>

            <DialogTitle as="h2" className="text-2xl font-bold mb-4 text-[#525252] flex items-center justify-center">
              {showIcon && (
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              )}
              {title}
            </DialogTitle>

            <div>{content}</div>

            <div className="flex justify-end mt-4 space-x-2">
              {showCancelButton && (
                <button 
                  onClick={onCancel || onClose} 
                   className="rounded-md bg-customGray px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-customLightGray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGray"
                >
                  {cancelButtonText}
                </button>
              )}
              {showConfirmButton && (
                <button 
                  onClick={onConfirm || onClose} 
                  className="rounded-md bg-customGreen px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-customLightGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGreen"
                >
                  {confirmButtonText}
                </button>
              )}
            </div> 
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CustomModal;
