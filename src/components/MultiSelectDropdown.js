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
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-0 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm overflow-hidden relative cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-4" >
                {selectedItems?.length} ítems seleccionados
              </span>
              <span className="flex items-center pr-2 pointer-events-none">
                <svg
                  className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </div>
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
            <div className="flex flex-col 2xl:flex-row justify-between p-1">
              <button onClick={handleSelectAll} className="bg-blue-500 text-white px-2 py-2 rounded-md mb-1 sm:mb-0 sm:mr-1 mb-2 text-xs mt-1">Seleccionar Todo</button>
              <button onClick={handleDeselectAll} className="bg-red-500 text-white px-2 py-2 rounded-md text-xs mt-1">Deseleccionar Todo</button>
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
