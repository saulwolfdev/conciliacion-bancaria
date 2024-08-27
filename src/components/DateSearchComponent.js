import React, { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

const DateSearchComponent = ({ data, label, inputId, onSearch }) => {
  const [value, setValue] = useState({ startDate: null, endDate: null });

  const handleValueChange = (newValue) => {
    let startDate = newValue.startDate ? new Date(newValue.startDate) : null;
    const endDate = newValue.endDate ? new Date(newValue.endDate) : null;

    const uiStartDate = new Date(startDate);

    if (startDate) {
      startDate.setDate(startDate.getDate() - 1);
    }

    console.log('Start Date (UI):', uiStartDate);
    console.log('Start Date (Filtro):', startDate);

    console.log('End Date:', endDate);

    setValue({ startDate: uiStartDate, endDate });

    const filteredData = data?.filter((item) => {
      const itemDate = new Date(item.fecha);
      console.log('Item Date:', itemDate);

      return (startDate ? itemDate >= startDate : true) && (endDate ? itemDate <= endDate : true);
    });

    console.log('Filtered Data:', filteredData);
    onSearch(filteredData);
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="relative mt-1 flex items-center">
        <Datepicker
          primaryColor={"green"}
          value={value}
          onChange={handleValueChange}
          placeholderText="Selecciona una fecha"
          displayFormat="DD/MM/YYYY"          
          inputClassName="w-full rounded-md border border-gray-300 py-2 pl-2 pr-14 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
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

export default DateSearchComponent;