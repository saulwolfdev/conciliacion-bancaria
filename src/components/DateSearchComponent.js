import React, { useState, useEffect } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { fetchDataBalance } from "@/api/fetchDataBalance";
import { fetchDataListar } from "@/api/fetchDataListar";
import { balance, listar } from "@/api/fintoc.mock";

const DateSearchComponent = ({ data, label, inputId, onSearch, setDataBalance, setDataListar, setDataTotals }) => { 
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//   const [dataListar, setDataListar] = useState(null);
// console.log("traspaso de dataListar:", dataListar)
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

  // useEffect(() => {
  //   const fetchAndSetData = async () => {
  //     try {        
  //       const data = balance;
  //       // console.log("Datos balance:", data);
  //       setDataBalance(data.data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };
  
  //   fetchAndSetData();
  // }, [value]);

  useEffect(() => {
    const fetchSetDataListar = async () => {
      try {
        const data = await fetchDataListar(value.startDate, value.endDate);
        console.log("Datos listar:", data);
        setDataListar(data.data);
        setDataTotals(data)
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSetDataListar();
  }, [value]);


  //para usar dataListar desde mock

  // useEffect(() => {
  //   const fetchSetDataListar = async () => {
  //     try {        
  //       const data = listar; 
  //       // console.log("Datos listar:", data);
  //       setDataListar(data.data);
  //       setDataTotals(data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };
  
  //   fetchSetDataListar();
  // }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-sm font-medium leading-6 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </label>
      </div>
      <div className="relative mt-2 flex items-center">
        <Datepicker
          primaryColor={"green"}
          showShortcuts={true}
          startFrom={startOfMonth}
          value={value}
          onChange={handleValueChange}
          placeholderText="Selecciona una fecha"
          displayFormat="DD/MM/YYYY"
          inputClassName="w-full rounded-md border border-gray-300 py-1.5 pl-2 pr-14 text-gray-900 shadow-sm focus:border-customGreen focus:ring-customGreen sm:text-sm sm:leading-6"
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
