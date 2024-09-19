import React from 'react';

const BottomSheet = ({ isOpen, onClose, children }) => {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'} `}>
      <div className="fixed inset-0" onClick={onClose}></div>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-lg shadow-lg">
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
