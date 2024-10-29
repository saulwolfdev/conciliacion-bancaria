import React, { useState, useEffect, useRef } from 'react';

const SelectBar = ({ options, onSelect, label, inputId, selectedOption, setSelectedOption, handleDateReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleChange = (value) => {
    if (value === 'all') {
      setSelectedOption('');
      handleDateReset();
    } else {
      setSelectedOption(value);
    }
    onSelect(value);
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="w-full max-w-full mx-left relative">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {label}
        </label>
      </div>
      <div
        className="border p-1 w-full flex items-center justify-between bg-white text-black cursor-pointer rounded-md ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen mt-2"
        tabIndex="0"
        onClick={() => {
          setIsOpen(!isOpen);
          handleDateReset();
        }}
      >
        <span className={`${selectedOption ? "text-gray-900" : "text-gray-500"} block overflow-hidden text-ellipsis whitespace-nowrap`}>
          {selectedOption || 'Seleccione una opción...'}
        </span>
        <svg className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute border w-full bg-white mt-1 z-10 shadow-lg rounded-md">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full rounded-md border-0 py-1 pl-2 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-md sm:leading-6"
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${index < filteredOptions.length - 1 ? 'border-b border-gray-300' : ''}`}
                onClick={() => handleChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectBar;
