import React, { useState } from 'react';

const SearchBar = ({ onSearch, label, inputId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium leading-6 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {label}
        </label>
      </div>
      <div className="relative mt-2 flex items-center">
        <input
          type="text"
          name="search"
          id={inputId}
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.8 pl-2 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customGreen sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default SearchBar;
