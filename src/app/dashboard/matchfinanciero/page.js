"use client";

import React, { useState, useEffect } from "react";
import { getFintoc } from "@fintoc/fintoc-js";
import { sendPostRequest } from "@/api/fintoc.api";
import AccountsModal from "@/components/AccountsModal";

const MatchFinanciero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holderType, setHolderType] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [widget, setWidget] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (holderType && isClient) {
      initializeWidget(holderType);
    }
  }, [holderType, isClient]);

  const initializeWidget = async (type) => {
    const product = "movements";
    const publicKey = "pk_live_1mLo7fccgUhV2TEYfzonwnEywbEbZzxv";
    const domain = window.location.hostname;
    const webhookUrl ="https://webhook.site/#!/view/240cb15c-7da5-4c3a-b86d-f41610ed261f";

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
          let dataId = "link_oObKGalip9eXP8y5";
          const data = await sendPostRequest(dataId);
          if (data) {
            setResponseData(data);
            setIsModalOpen(true);
          }
        },
        onExit: () => {
          console.log("Fintoc exit");
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

  const transactions1 = [
    { amount: "$57.960", description: "eCOMMERCE MERPAGO BUILDER Las" },
    { amount: "$16.060", description: "REDCOMPRA CLUB DE GOLF LOS SAN" },
  ];

  const transactions2 = [];

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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



  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://inetevo-release.azurewebsites.net/finanzas/get_cuentas_contables/'; 
      const authToken = 'eyJraWQiOiJaakpmd0V1RW80Ym1aVDBxcUFxS3dwMHY1XC91NHhNbXdGTlRpaUcxZUdYbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkNGI4MjQzOC0xMGUxLTcwYTMtZDI5NC1jMTEwYzRhYzY0ODgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfOHJOakFteVhzIiwiY29nbml0bzp1c2VybmFtZSI6Imltb3JhbGVzIiwib3JpZ2luX2p0aSI6IjYzNDhjODc3LTUyY2YtNDc3YS05ZGE4LWE4ZDI4MzY5ZmQ5NSIsImF1ZCI6IjI1cGk2N2dzZjg5Y291djJmcGlhbWo4N3NpIiwiZXZlbnRfaWQiOiJkOGNiYTJlMy1iZjUzLTRkZjktOThjMy0wMjUyYjM1NDRhZWYiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcyMzEzMjUwNSwibmFtZSI6IklzYWJlbCBNb3JhbGVzIiwiZXhwIjoxNzIzMTM5NzI3LCJpYXQiOjE3MjMxMzYxMjcsImp0aSI6IjU2YWJiMzNiLWZjMmItNGM2Mi04NWY1LTVhZjcyNDA5Nzg1NyIsImVtYWlsIjoieXRhcGlhQGluZm9ybWF0LmNsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICJ9.tkiQ4jsheVEYJFeC_Ish8qlwKsVUyWWvNbgvJfP7rDYI_cRwjnOVOmXWl3OaKlZ6cQjjFofbJlbeFS7SQfQCXYuQoBi_Eakmk8l_EfWNqe5_J7fh8i61s2j1iJKTzhgWNnC2-wKM8Cy__uw5ok-9D4wKrti6c01RjA705DWf1Q1bBohsntLVj0F5Ba8XHNoXE3xsIYMjlE-sy7Uckt-7GsBQP1-q3jaXj1ujWatdTlZb57HHfqiES8V1lpUeZbn1gQ2Y4tYOssGDWJLh4LyMEgWHxL24ITOEaY2B6bDtAh6ShFjcqnESiY6UcbdWXO0HfZ1KcgkhCVZgQ2OB5jJUNw';

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();
        console.log("Datos Cuentas Contables:",data); 

      } catch (error) {
        console.error('Error:', error); 
      }
    };

    fetchData(); 
  }, []);


  return (
    <>
      {/* <button 
        className="bg-blue-500 text-white p-2 rounded mt-4"
        onClick={openModal}
      >
        Abrir Modal
      </button> */}
      <AccountsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={responseData}
        onLoad={handleLoadAccounts}
      />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="grid grid-cols-3 gap-4 flex-grow">
            <div className="bg-white shadow-md rounded p-4 text-center">
              <h2 className="text-2xl font-bold text-blue-700">$7.409.824</h2>
              <p className="text-gray-500">Saldo Consolidado Pesos</p>
            </div>
            <div className="bg-white shadow-md rounded p-4 text-center">
              <h2 className="text-2xl font-bold text-blue-700">$0</h2>
              <p className="text-gray-500">Saldo Consolidado Dolares</p>
            </div>
            <div className="bg-white shadow-md rounded p-4 text-center">
              <h2 className="text-2xl font-bold text-blue-700">$0</h2>
              <p className="text-gray-500">Saldo Consolidado Euros</p>
            </div>
          </div>
          <button
            className="bg-red-500 text-white p-2 rounded h-full ml-4"
            onClick={() => setIsOpen(true)}
          >
            Nuevo Banco
          </button>
        </div>

        <div className="flex flex-col mt-6 space-y-4">
  {filteredAccounts.length > 0 ? (
    filteredAccounts.map((account) => (
      <div key={account.id} className="flex space-x-4">
        {['CLP', 'USD'].map((currency) => {
          const balance = account.currency === currency ? account.balance.available : 0;
          return (
            <div
              key={currency}
              className="bg-white shadow-md rounded p-6 flex-1 min-w-[280px]"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-red-600 text-xl font-bold">
                    {responseData?.data?.institution?.name}
                  </h3>
                  <p className="text-gray-600 mb-4">N° {account.number}</p>
                  <h2 className="text-3xl font-bold text-blue-700">
                    {currency === "CLP" ? "$" : "U$"}
                    {balance.toLocaleString()}
                  </h2>
                </div>
                <div className="flex">
                  <button className="bg-red-500 text-white p-2 rounded mr-2">
                    ↻
                  </button>
                  <button className="bg-red-500 text-white p-2 rounded">
                    ...
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-gray-600 mb-2">Últimos movimientos</h4>
                <p className="text-gray-500">Sin movimientos</p>
              </div>
            </div>
          );
        })}
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 text-2xl text-center">
        Aún no hay banco cargado
      </p>
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
    </>
  );
};

export default MatchFinanciero;