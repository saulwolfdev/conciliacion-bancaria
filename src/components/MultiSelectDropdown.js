import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const options = ['Anulado', 'Match', 'Sin Match'];
  const [selectedItems, setSelectedItems] = useState(options);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectAll = () => {
    setSelectedItems(options);
    onFilterChange(options);
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
    onFilterChange([]);
  };

  const handleCheckboxChange = (option) => {
    let updatedSelectedItems;
    if (selectedItems.includes(option)) {
      updatedSelectedItems = selectedItems.filter(item => item !== option);
    } else {
      updatedSelectedItems = [...selectedItems, option];
    }
    setSelectedItems(updatedSelectedItems);
    onFilterChange(updatedSelectedItems);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mt-2" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm overflow-hidden"
        >
          <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-4">
            {selectedItems?.length} items seleccionados
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
        {isOpen && (
          <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <div className="flex justify-between p-1">
              <button onClick={handleSelectAll} className="bg-blue-500 text-white px-2 py-2 rounded-md mr-1 text-xs">Seleccionar Todo</button>
              <button onClick={handleDeselectAll} className="bg-red-500 text-white px-2 py-2 rounded-md text-xs">Deseleccionar Todo</button>
            </div>
            <ul className="max-h-30 overflow-auto w-full">
              {filteredOptions.map(option => (
                <li key={option} className="flex items-center justify-between p-2 text-sm">
                  <span>{option}</span>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default MultiSelectDropdown;