"use client";
import React, { useState } from 'react';

const SearchComponent = ({ data, label, inputId, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === '') {      
      onSearch(data); 
    } else {      
      const filteredData = data?.filter((item) => {       
        switch (true) {
          case item.fecha && item.fecha.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          case item.rut_titular.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          case item.nombre_titular.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          case item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          case item.referencia.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          case item.monto.toString().includes(searchTerm):
            return true;
          case item.estado.toLowerCase().includes(searchTerm.toLowerCase()):
            return true;
          default:
            return false; 
        }
      });
      onSearch(filteredData); 
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="relative mt-2 flex items-center">
        <input
          type="text"
          name="search"
          id={inputId}
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />        
      </div>      
    </div>
  );
};

export default SearchComponent;