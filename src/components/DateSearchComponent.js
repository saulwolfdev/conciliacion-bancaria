import React, { useState, useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { fetchDataBalance } from "@/api/fetchDataBalance";

const DateSearchComponent = ({ data, label, inputId, onSearch, setDataBalance }) => { 
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [value, setValue] = useState({ startDate: startOfMonth, endDate: endOfMonth });  

  const handleValueChange = (newValue) => {
    const startDate = newValue.startDate ? new Date(newValue.startDate) : null;
    const endDate = newValue.endDate ? new Date(newValue.endDate) : null;

    setValue({ startDate, endDate });

    const filteredData = data?.filter((item) => {
      const itemDate = new Date(item.fecha);
      return (startDate ? itemDate >= startDate : true) && (endDate ? itemDate <= endDate : true);
    });

    onSearch(filteredData);
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      try {
        const data = await fetchDataBalance(value.startDate, value.endDate);
        console.log("Datos balance:", data);
        setDataBalance(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndSetData();
  }, [value]);

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="relative mt-2 flex items-center">
        <Datepicker
          primaryColor={"green"}
          showShortcuts={true}
          startFrom={startOfMonth}
          value={value}
          onChange={handleValueChange}
          placeholderText="Selecciona una fecha"
          displayFormat="DD/MM/YYYY"
          inputClassName="w-full rounded-md border border-gray-300 py-1.5 pl-2 pr-14 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
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
