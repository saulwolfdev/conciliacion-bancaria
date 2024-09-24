"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { getFintoc } from "@fintoc/fintoc-js";
import { sendPostRequest } from "@/api/fintoc.api";
import { dashboard } from "@/api/fintoc.mock";
import AccountsModal from "@/components/AccountsModal";
import BreadCrumbs from "@/components/BreadCrumbs";

const MatchFinanciero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holderType, setHolderType] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [widget, setWidget] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [lineCredit, setLineCredit] = useState(null);
  const [dataDashboard, setDataDashboard] = useState([]);
  const dropdownRef = useRef(null);
  const router = useRouter();
console.log("dataDashboard nuevo URL:", dataDashboard)
  const handleVerCartolas = () => {
    router.push('/dashboard/matchfinanciero/cartolas'); 
  };

  const pages = [
    { name: 'Bancos', href: '/dashboard/matchfinanciero', current: true }, 
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (holderType && isClient) {
      initializeWidget(holderType);
    }
  }, [holderType, isClient]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = dashboard;
  //       setDataDashboard(data.data);
  //       console.log("Datos Dashboard:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_dashboard/");
        const data = await response.json();
        setDataDashboard(data.data);
        console.log("Datos Dashboard:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const initializeWidget = async (type) => {
    const product = "movements";
    const publicKey = "pk_live_1mLo7fccgUhV2TEYfzonwnEywbEbZzxv";
    const domain = window.location.hostname;
    const webhookUrl ="https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_pendiente/";
    // const webhookUrl ="https://webhook.site/#!/view/240cb15c-7da5-4c3a-b86d-f41610ed261f";
    try {
      const Fintoc = await getFintoc();
      if (widget) {
        widget.destroy();
        setWidget(null);
      }
      const newWidget = Fintoc.create({
        holderType: type,
        product: product,
        publicKey: publicKey,
        webhookUrl: webhookUrl,
        
        onSuccess: async (res) => {
          // let dataId = res.id;
          let dataId = "link_oObKGalip9eXP8y5";
          console.log("Respuesta ID data:", dataId)
          const data = await sendPostRequest(dataId);
          if (data) {            
            const filteredAccount = data.data.accounts.filter(account => 
              ["checking_account", "savings_account", "sight_account", "rut_account"].includes(account.type)
            );
            setResponseData({ ...data, data: { ...data.data, accounts: filteredAccount } });
            setLineCredit(data.data.accounts.filter(account => account.type === "line_of_credit"))
            setIsModalOpen(true);
          }
        },
        onExit: () => {
          console.log("Fintoc exit");          
          if (widget) {
            widget.destroy();
            setWidget(null);
          }
        },
      });
      setWidget(newWidget);
      newWidget.open();
      setIsOpen(false);
    } catch (error) {
      console.error("Error initializing Fintoc widget:", error);
    }
  };

  const handleOptionClick = (type) => {
    console.log("holderType:", type);    
    setHolderType(type);
  };

  const handleClose = () => {
    if (widget) {
      widget.destroy();
      setWidget(null);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    console.log("respuesta", responseData);
    if (
      responseData &&
      responseData?.data?.accounts &&
      selectedAccounts.length > 0
    ) {
      const filtered = responseData?.data?.accounts.filter((account) =>
        selectedAccounts.includes(account.id)
      );
      setFilteredAccounts(filtered);
      console.log("Filtered Accounts:", filtered);
    }
  }, [responseData, selectedAccounts]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleDropdown = (id) => {
    setIsDropdownOpen(prevId => prevId === id ? null : id);
  };

  useEffect(() => {
    function handleClickOutside(event) {      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(null);
      }
    }
    
    if (isDropdownOpen !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLoadAccounts = (accounts) => {
    setSelectedAccounts(accounts);
    console.log("Selected Accounts father:", accounts);
  };

  console.log("responseData father:", responseData?.data?.accounts);
  console.log("selectedAccounts father:", selectedAccounts);
  console.log("selectedAccounts filtered:", filteredAccounts);
  filteredAccounts.map((account) => {
    console.log("Account number:", account.number);
  });  

  console.log("datos filtrados:", lineCredit)

  console.log("dataDashboard api:", dataDashboard)
  const numeros = dataDashboard.map(item => item.numero);
  console.log(numeros);

  const handleCancel = () => {
    setIsModalOpen(false);
    if (widget) {
      widget.destroy();
      setWidget(null);
    }
    setIsOpen(true); 
  };

  const stats = dataDashboard && dataDashboard.length > 0
  ? [
      { 
        name: 'Pesos', 
        value: dataDashboard
          .filter(account => account.moneda === 1)
          .reduce((acc, account) => acc + account.monto_disponible, 0)
          .toLocaleString("es-CL", { style: "currency", currency: "CLP" }),
        change: ' ' 
      },
      { 
        name: 'Dolares', 
        value: dataDashboard
          .filter(account => account.moneda === 2)
          .reduce((acc, account) => acc + account.monto_disponible, 0)
          .toLocaleString("es-CL", { style: "currency", currency: "USD" }), 
        change: ' ' 
      },
      { 
        name: 'Euros',         
        value: (0).toLocaleString("es-CL", { style: "currency", currency: "EUR" }), 
        change: ' ' 
      },
    ]
  : [];

  return (
    <div className="container md:w-1/1 md:px-16">   
      <BreadCrumbs pages={pages} />   
      <AccountsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCancel={handleCancel}
        data={responseData}
        onLoad={handleLoadAccounts}
        lineOfCredit={lineCredit}
      />
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col justify-between items-center mb-4 sm:flex-row"> 
          <div className="grid grid-cols-1 gap-4 flex-grow md:grid-cols-3 sm:grid-cols-1 mb-4">
            {stats.map((stat) => (
              stat.value !== undefined && (
                <div
                  key={stat.name}
                  className="bg-white shadow-md rounded p-4 text-center"
                >
                  <div className="flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-blue-700">
                      {stat.value}
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Saldo Consolidado {stat.name}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>

          <button
            className="bg-customGreen text-white p-2 rounded h-full ml-4 sm:ml-4" 
            onClick={() => setIsOpen(true)}
          >
            Nuevo Banco
          </button>
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        
         {dataDashboard.length > 0 ? (
          dataDashboard.map((account) => {    
            const currencySymbol = account.moneda === 1 ? "CLP" : "USD";
            const balance = account.monto_disponible;
            return (
              <div key={account.id} className="flex space-x-4">       
                <div className="bg-white shadow-md rounded p-6 flex-1 min-w-[280px]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-red-600 text-xl font-bold">
                        {account.banco.nombre}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        N° {account.numero}
                      </p>
                      <div className="mb-0">
                        <h2 className="text-2xl font-bold text-blue-700">
                          {currencySymbol === "CLP" ? "$" : "U$"}
                          {balance.toLocaleString()}
                        </h2>
                        <p className="text-gray-400">Saldo disponible</p>
                      </div>
                      
                      <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 items-center"> 
                        <div className="mr-12 mt-4 md:mr-0">
                          <h2 className="text-1xl text-blue-700">
                            {currencySymbol === "CLP" ? "$" : "U$"}
                            {account.monto_contable.toLocaleString()}
                          </h2>
                          <p className="text-gray-400">Saldo contable</p>
                        </div>
                        <div>
                          <h2 className="text-1xl text-blue-700">
                            {currencySymbol === "CLP" ? "$" : "U$"}
                            {(account.linea_credito.saldo_total || 0).toLocaleString()}
                          </h2>
                          <p className="text-gray-400">Saldo línea de crédito</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 relative">
                      <button className="bg-customGreen text-white p-2 rounded">
                        ↻
                      </button>
                      <button 
                        onClick={() => toggleDropdown(account.id)}
                        className="bg-white text-customGreen p-2 rounded border border-customGreen"
                      >
                        ...
                      </button>
                      {isDropdownOpen === account.id && ( 
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 mt-11 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                          <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Migrar a Sincronización
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Actualizar
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => router.push('/dashboard/matchfinanciero/cartolas?tab=match')}>
                              Match
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => router.push('/dashboard/matchfinanciero/cartolas?tab=movimientos')}>
                              Movimientos
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Eliminar
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                <h4 className="text-gray-700 font-semibold mb-0">Últimos movimientos</h4>
                <div className="bg-white shadow-lg p-4 mt-2 rounded h-35 overflow-y-hide">
                  {account.movimientos.length > 0 ? (
                    account.movimientos.map((movimiento, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <div>
                          <p className={movimiento.cargos > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                            {movimiento.cargos > 0 ? '+' : '-'}
                            ${parseFloat(movimiento.cargos || movimiento.abonos).toLocaleString()}
                          </p>
                          <p className="text-gray-500">{movimiento.nombre_contacto}</p>
                        </div>
                        <div>
                          <p className={`text-${movimiento.cargos > 0 ? 'green' : 'red'}-500`}>
                            {movimiento.cargos > 0 ? 'Cargo' : 'Abono'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center mt-8">
                      <p className="text-gray-500">Sin movimientos</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-2">
                <button
                  onClick={() => {
                    localStorage.setItem('accountNumber', account.numero);
                    router.push('/dashboard/matchfinanciero/cartolas?tab=movimientos');
                  }}
                  className="bg-transparent px-4 py-2 rounded text-blue-500 hover:text-blue-600 focus:text-blue-600"
                >
                  Ver cartolas
                </button>
                </div>

                <div className="flex justify-between mt-2">
                  <p className="text-red-500">Últimos movimientos sin match: 7</p>
                  <button 
                  onClick={() => router.push('/dashboard/matchfinanciero/cartolas?tab=match')}
                    className="bg-customGreen text-white px-4 py-2 rounded"
                  >
                  Match financiero
                  </button>
                    </div>
                  </div>
                </div>

                  );
                })
                ) : (
                  <div className="col-span-1 md:col-span-2 flex flex-col mt-6 space-y-4">
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-500 text-2xl text-center">
                        Aún no hay banco cargado
                      </p>
                    </div>
                  </div>
                )}         
              </div>

        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Conecta un Banco</h2>
                <button className="text-xl font-bold" onClick={handleClose}>
                  &times;
                </button>
              </div>
              <p className="mt-4">Selecciona el tipo de cuenta:</p>
              <div className="mt-4">
                <div
                  className="bg-gray-100 p-4 rounded mb-4 cursor-pointer"
                  onClick={() => handleOptionClick("individual")}
                >
                  <h3 className="font-bold">Persona</h3>
                  <p>
                    Disponible para: Banco BICE, BCI, Itaú, Scotiabank, Banco
                    Estado, Banco de Chile, Santander.
                  </p>
                </div>
                <div
                  className="bg-gray-100 p-4 rounded mb-4 cursor-pointer"
                  onClick={() => handleOptionClick("business")}
                >
                  <h3 className="font-bold">Empresa</h3>
                  <p>
                    Disponible para: Banco BICE, BCI, Itaú, Scotiabank, Banco
                    Estado, Banco de Chile, Santander, 360 Connect, Security.
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded cursor-pointer">
                  <h3 className="font-bold">Crear Banco</h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchFinanciero;