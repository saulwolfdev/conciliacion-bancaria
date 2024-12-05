import React, { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

const DateSearchBar = ({ onDateChange, label, inputId, setSelectedOption, selectedDateRange, setSelectedDateRange }) => {
//   const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });

  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    onDateChange(dateRange);
  };

  return (
    <div onClick={() => setSelectedOption("")}>
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </label>
      </div>      
      <div className="relative mt-2 flex items-center" >
        <Datepicker
          primaryColor={"green"}
          showShortcuts={true}
          value={selectedDateRange}
          onChange={handleDateChange}
          placeholderText="Selecciona un rango de fechas"
          displayFormat="DD/MM/YYYY"
          inputClassName="w-full rounded-md border border-gray-300 py-1 pl-2 pr-14 text-gray-900 shadow-sm focus:border-customGreen focus:ring-customGreen sm:text-xs sm:leading-5"
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DateSearchBar;
