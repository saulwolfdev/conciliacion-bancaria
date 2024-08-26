"use client";
import React, { useState } from 'react';

const SearchComponent = ({ data, label, inputId, onSearch, searchType, searchSign }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    let value = event.target.value;
    if (searchType === 'monto') {     
      value = value.replace(/[^0-9,-]/g, '');
      value = formatNumber(value);
    }
    setSearchTerm(value);

    if (value.trim() === '') {
      onSearch(data);
    } else {
      const filteredData = data?.filter((item) => {
        if (searchType === 'general') {
          return (
            (item.fecha && item.fecha.toLowerCase().includes(value.toLowerCase())) ||
            (item.rut_titular && item.rut_titular.toLowerCase().includes(value.toLowerCase())) ||
            (item.nombre_titular && item.nombre_titular.toLowerCase().includes(value.toLowerCase())) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(value.toLowerCase())) ||
            (item.referencia && item.referencia.toLowerCase().includes(value.toLowerCase())) ||
            (item.monto && item.monto.toString().includes(value)) ||
            (item.estado && item.estado.toLowerCase().includes(value.toLowerCase()))
          );
        } else if (searchType === 'monto') {
          const formattedValue = value.replace(/\./g, '').replace(',', '.');
          if (searchSign === 'positive') {
            return item.monto && item.monto.toString().includes(formattedValue) && !item.monto.toString().startsWith('-');
          } else if (searchSign === 'negative') {
            return item.monto && item.monto.toString().includes(formattedValue) && item.monto.toString().startsWith('-');
          } else {
            return item.monto && item.monto.toString().includes(formattedValue);
          }
        }
        return false;
      });
      onSearch(filteredData);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '';    
    num = num.replace(/\./g, '');    
    const parts = num.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
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
          className={`block w-full rounded-md border-0 py-1.5 ${searchType === 'monto' ? 'pr-2 text-right' : 'pl-2 pr-14'} text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          placeholder={searchType === 'monto' ? '0,00' : 'Búsqueda libre'}
        />
      </div>
    </div>
  );
};

export default SearchComponent;