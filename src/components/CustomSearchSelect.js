import React, { useState, useEffect, useRef } from "react";

const CustomSearchSelect = ({ options, value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="mt-2 relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 text-left"
        >
          {value ? options.find(option => option.value === value)?.label : "Seleccionar"}
        </button>
        <svg
          className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-full border-b border-gray-300 focus:ring-2 focus:ring-indigo-600"
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
    </div>
  );
};

export default CustomSearchSelect;
