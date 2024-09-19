import React, { useState, useEffect } from 'react';
import SearchComponent from "@/components/SearchComponent";  
import DateSearchComponent from "@/components/DateSearchComponent"; 
import MultiSelectDropdown from "@/components/MultiSelectDropdown"; 

const SearchCard = ({ onSearchChange, dataBalance, setDataBalance, dataListar, setDataListar, setDataTotals }) => {  
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  // const [dataListar, setDataListar] = useState(null);
  const [filteredData, setFilteredData] = useState(dataListar);
  // console.log("traspaso de dataListar:", dataListar)
  // const [dataBalance, setDataBalance] = useState([]); 
  

  useEffect(() => {
    handleSearch();
  }, [minAmount, maxAmount, dataBalance]);
// console.log("balanceData cob datos en padre:", dataBalance)
  const handleSearch = (filteredData) => {
    let filteredItems = filteredData || dataListar;
  
    const min = parseFloat(minAmount.replace(/\./g, '').replace(',', '.')) || -Infinity;
    const max = parseFloat(maxAmount.replace(/\./g, '').replace(',', '.')) || Infinity;
  
    if (minAmount) {
      filteredItems = filteredItems.filter(item => {
        const absMonto = Math.abs(parseFloat(item.monto));
        return absMonto >= Math.abs(min);
      });
    }
  
    if (maxAmount) {
      filteredItems = filteredItems.filter(item => {
        const absMonto = Math.abs(parseFloat(item.monto));
        return absMonto <= Math.abs(max);
      });
    }
  
    setFilteredData(filteredItems);
    onSearchChange(filteredItems);
  };

  const handleMinAmountChange = (value) => {
    setMinAmount(value);
  };

  const handleMaxAmountChange = (value) => {
    setMaxAmount(value);
  };

  const handleDateSearch = (filteredItems) => {
    handleSearch(filteredItems);
  };

  const handleFilterChange = (selectedItems) => {
    let filteredItems = dataListar.filter(item => {
      if (selectedItems.includes('Sin Match') && item.estado === 'Sin Conciliar') return true;
      if (selectedItems.includes('Match') && item.estado === 'Conciliado') return true;
      if (selectedItems.includes('Anulado') && item.estado === 'Anulado') return true;
      return false;
    });
    setFilteredData(filteredItems);
    onSearchChange(filteredItems);
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mt-6 mb-4">
      <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Buscar por</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-2 mb-4">
          <SearchComponent data={dataListar} label="Búsqueda libre" inputId="search-free" onSearch={handleSearch} searchType="general"/>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-2 mb-4">
          <SearchComponent
              label="Monto mínimo"
              inputId="search-min"
              onSearch={handleMinAmountChange}
              searchType="amount"
              amountType="min"
            />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-2 mb-4">
          <SearchComponent
              label="Monto máximo"
              inputId="search-max"
              onSearch={handleMaxAmountChange}
              searchType="amount"
              amountType="max"
            />
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-2 mb-4">
          <DateSearchComponent
            data={dataListar}
            label="Fecha: desde~hasta"
            inputId="date-search-start"
            onSearch={handleDateSearch}
            setDataBalance={setDataBalance} 
            setDataListar={setDataListar}
            setDataTotals={setDataTotals}
            type="start"
          />
        </div>       
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 px-2 mb-4">
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Estados</label>
          <MultiSelectDropdown onFilterChange={handleFilterChange} />          
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
