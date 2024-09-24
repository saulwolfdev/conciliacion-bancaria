import React from 'react';

const BottomSheet = ({ isOpen, onClose, children }) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300 ease-in-out`}>
      <div className="bg-white p-4 shadow-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕ 
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
