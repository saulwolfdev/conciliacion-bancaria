import React, { useState } from "react";

const CustomSearchSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border rounded p-2 w-full text-left"
      >
        {value ? options.find(option => option.value === value)?.label : "Seleccionar"}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-0 bg-white border rounded shadow-lg">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full border-b"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => !option.disabled && handleSelectOption(option.value)}
                  className={`p-2 cursor-pointer ${option.disabled ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                  style={{ color: option.disabled ? 'gray' : 'black' }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No hay opciones</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSearchSelect;
