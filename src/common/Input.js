// Input.js
import React from 'react';

const Input = ({ labelName, value, type, handleInputChange, className }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{labelName}</label>
      <input
        className={`account-input ${className}`}
        type={type}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Input; // Ensure that Input component is exported as default
