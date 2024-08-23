import React, { useState } from 'react';
import SearchComponent from "@/components/SearchComponent";

const SearchCard = ({ onSearchChange, dataListar }) => {
    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = (filteredItems) => {
      setFilteredData(filteredItems);
      onSearchChange(filteredItems);
    };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6 mb-4">
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Buscar por</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
        <SearchComponent data={dataListar} label="Búsqueda libre" inputId="search-free" onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
          <SearchComponent data={dataListar} label="Monto mínimo" inputId="search-free" onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
          <SearchComponent data={dataListar} label="Monto máximo" inputId="search-free" onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
          <SearchComponent data={dataListar} label="Fecha Inicio" inputId="search-free" onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
          <SearchComponent data={dataListar} label="Fecha Término" inputId="search-free" onSearch={handleSearch} />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4">
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Estados</label>
          <select id="status" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option>3 items seleccionados</option>            
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
