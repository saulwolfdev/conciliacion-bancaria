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
  const [lineCredit, setLineCredit] = useState(null);

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
            setLineCredit(data.data.accounts.filter(account => account.type === "line_of_credit"))
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

  return (
    <>      
      <AccountsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={responseData}
        onLoad={handleLoadAccounts}
        lineOfCredit={lineCredit}
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
                {["CLP", "USD"].map((currency) => {
                  const balance =
                    account.currency === currency
                      ? account.balance.available
                      : 0;
                  return (
                    <div
                      key={currency}
                      className="bg-white shadow-md rounded p-6 flex-1 min-w-[280px]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-red-600 text-xl font-bold">
                            {responseData?.data?.institution?.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            N° {account.number}
                          </p>
                          <h2 className="text-3xl font-bold text-blue-700">
                            {currency === "CLP" ? "$" : "U$"}
                            {balance.toLocaleString()}
                          </h2>
                          <p className="text-gray-400 mb-4">Saldo disponible</p>
                        </div>
                        <div className="flex space-x-1">
                          <button className="bg-red-500 text-white p-2 rounded">
                            ↻
                          </button>
                          <button className="bg-red-500 text-white p-2 rounded">
                            ...
                          </button>
                        </div>
                      </div>
                      <h4 className="text-gray-700 font-semibold mb-2">
                        Últimos movimientos
                      </h4>
                      <div className="bg-white shadow-lg p-4 rounded h-32 flex items-center justify-center">
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