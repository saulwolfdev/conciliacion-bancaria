"use client";
import React, { useState, useEffect } from 'react';

const SearchComponent = ({ data, label, inputId, onSearch, searchType, amountType }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchType === 'general') {
      if (searchTerm.trim() === '') {
        onSearch(data);
      } else {
        const filteredData = data?.filter((item) => {
          return (
            (item.fecha && item.fecha.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.rut_titular && item.rut_titular.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.nombre_titular && item.nombre_titular.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.referencia && item.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.monto && item.monto.toString().includes(searchTerm)) ||
            (item.estado && item.estado.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });
        onSearch(filteredData);
      }
    } else if (searchType === 'amount') {      
      onSearch(searchTerm, amountType);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '';
    num = num.replace(/\./g, '');
    const parts = num.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  const handleChange = (event) => {
    let value = event.target.value;
    if (searchType === 'amount') {
      value = formatNumber(value.replace(/[^0-9,]/g, ''));
    }
    setSearchTerm(value);
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative mt-2 flex items-center">
        <input
          type="text"
          name="search"
          id={inputId}
          value={searchTerm}
          onChange={handleChange}
          className={`block w-full rounded-md border-0 py-1.8 ${
            searchType === 'amount' ? 'pr-2 text-right' : 'pl-2 pr-14'
          } text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          placeholder={searchType === 'amount' ? '0,00' : 'Búsqueda libre'}
        />
      </div>
    </div>
  );
};

export default SearchComponent;