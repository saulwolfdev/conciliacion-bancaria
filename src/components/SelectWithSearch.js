import React, { useState, useEffect, useRef } from 'react';

const SelectWithSearch = ({ filteredCuentasCorrientes, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const dropdownRef = useRef(null);

  const filteredData = filteredCuentasCorrientes?.filter(item =>
    item?.glosa_detalle_compte_his.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueData = filteredData ? Object.values(
    filteredData.reduce((acc, item) => {
      acc[item.glosa_detalle_compte_his] = item;
      return acc;
    }, {})
  ) : [];

  const handleSelect = (item) => {
    setSelectedAccount(item);
    setIsOpen(false);
    onSelect(item);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-left mt-6" ref={dropdownRef}>
      <div
        className="border p-2 w-full flex items-center justify-between bg-white text-black cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedAccount ? `${selectedAccount.glosa_detalle_compte_his}` : 'Selecciona una cuenta'}
        </span>
        <svg className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute border w-full bg-white mt-1 z-10 shadow-lg">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-b p-2 w-full"
          />
          <div className="max-h-60 overflow-y-auto">
            {uniqueData.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(item)}
              >
                <span>{item.glosa_detalle_compte_his}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
