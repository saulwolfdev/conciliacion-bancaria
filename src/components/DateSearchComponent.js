"use client";
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

registerLocale('es', es);

const DateSearchComponent = ({ data, label, inputId, onSearch, type }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      handleSearch();
    }
  }, [selectedDate]);

  const handleSearch = () => {
    const filteredData = data?.filter((item) => {
      const itemDate = new Date(item.fecha);
      return type === 'start' ? itemDate >= selectedDate : itemDate <= selectedDate;
    });

    onSearch(filteredData);
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="relative mt-2 flex items-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText={type === 'start' ? "Fecha Inicio" : "Fecha Término"}
          dateFormat="dd/MM/yyyy"
          locale="es"
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default DateSearchComponent;
