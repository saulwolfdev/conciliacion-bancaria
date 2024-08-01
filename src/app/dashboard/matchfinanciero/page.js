"use client";

import React, { useState, useEffect } from "react";
import { getFintoc } from "@fintoc/fintoc-js";
import { createIntegration,createIntegrationTest } from '@/api/fintoc.api';
import axios from 'axios';

const MatchFinanciero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holderType, setHolderType] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [widget, setWidget] = useState(null);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (holderType && isClient) {
      initializeWidget(holderType);
    }
  }, [holderType, isClient]);

  // const sendPostRequest = async (dataId) => {
  //   try {
  //     const response = await axios.post('https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_integracion_data2/', 
  //       { id: dataId },
  //       { headers: { 'Content-Type': 'application/json' } }
  //     );

  //     console.log('Complete data:', response.data);
  //   } catch (error) {
  //     if (error.response) {
  //       console.error('data error!', error.response.data);
  //     } else if (error.request) {
  //       console.error('No response:', error.request);
  //     } else {
  //       console.error('Error setting:', error.message);
  //     }
  //   }
  // };

  const initializeWidget = async (type) => {
    const product = "movements";
    const publicKey = "pk_live_1mLo7fccgUhV2TEYfzonwnEywbEbZzxv";
    const domain = window.location.hostname;
    const webhookUrl = "https://webhook.site/4fdd6070-b7d1-427b-934d-f6c825217d8f";

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
        onSuccess: (res) => {   
          let dataId = res.id       
          setResponseData(res);
          console.log("dataIdType:", typeof(dataId))
          console.log("dataId:", dataId)
          //EJEMPLO DE TEST 
          createIntegrationTest({dataId})
          
           .then(response => {
           console.log('Paso correctamente el Id de Ejemplo de post de ejemplo', response.data);
           })

          // createIntegration({ dataId })

          // .then(response => {
          //   console.log('Satisfactorio:', response.data);
          // })
          // .catch(error => {
          //   console.error('Error:', error);
          // });

        },
        onExit: (res) => {
          console.log("Exit", res);
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
    // console.log("respuesta", responseData?.institution?.name);
  }, [responseData]);


  

  // const sendPostRequestTest = async () => {
  //   const requestOptions = {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ 
  //       id: "000",
  //       userId: "11",
  //       title: "titulo nuevo",
  //       body: "algo del body"
  //     }),
  //   };
  
  //   try {
  //     const response = await fetch('https://jsonplaceholder.typicode.com/posts', requestOptions);
      
  //     if (!response.ok) {
  //       const error = await response.text();
  //       throw new Error(error);
  //     }
  
  //     const data = await response.json();
  //     console.log('Complete data:', data);
  //   } catch (error) {
  //     console.error('data error', error);
  //   }
  // };
  
  // sendPostRequestTest();



  return (
    <>
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
          className="bg-red-500 text-white p-2 rounded ml-4"
          onClick={() => setIsOpen(true)}
        >
          Nuevo Banco
        </button>
      </div>

      <div className="flex mt-6">
        <div className="bg-white shadow-md rounded p-6 m-4 flex-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-red-600 text-xl font-bold">{responseData?.institution?.name}</h3>
              <p className="text-gray-600 mb-4">N° 977063116</p>
              <h2 className="text-3xl font-bold text-blue-700">$7.409.824</h2>
            </div>
            <div className="flex">
              <button className="bg-red-500 text-white p-2 rounded mr-2">
                ↻
              </button>
              <button className="bg-red-500 text-white p-2 rounded">...</button>
            </div>
          </div>
          <div>
            <h4 className="text-gray-600 mb-2">Últimos movimientos</h4>
            {transactions1.length > 0 ? (
              transactions1.map((tx, index) => (
                <div key={index} className="bg-red-50 p-2 rounded mb-2">
                  <span className="block text-red-600 font-semibold">
                    {tx.amount}
                  </span>
                  <span className="block text-gray-600">{tx.description}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Sin movimientos</p>
            )}
          </div>
          {/* <p className="text-gray-500 mt-4">Últimos movimientos sin match: 485</p>
          <button className="bg-red-500 text-white p-2 rounded mt-2">Match financieros</button> */}
        </div>
        <div className="bg-white shadow-md rounded p-6 m-4 flex-1">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-red-600 text-xl font-bold">{responseData?.institution?.name}</h3>
              <p className="text-gray-600 mb-4">N° 982939909</p>
              <h2 className="text-3xl font-bold text-blue-700">U$598,71</h2>
            </div>
            <div className="flex">
              <button className="bg-red-500 text-white p-2 rounded mr-2">
                ↻
              </button>
              <button className="bg-red-500 text-white p-2 rounded">...</button>
            </div>
          </div>
          <div>
            <h4 className="text-gray-600 mb-2">Últimos movimientos</h4>
            {transactions2.length > 0 ? (
              transactions2.map((tx, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-red-50 p-2 rounded mb-2"
                >
                  <span className="text-red-600 font-semibold">
                    {tx.amount}
                  </span>
                  <span className="text-gray-600">{tx.description}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Sin movimientos</p>
            )}
          </div>
          {/* <p className="text-gray-500 mt-4">Últimos movimientos sin match: 0</p>
          <button className="bg-red-500 text-white p-2 rounded mt-2">Match financieros</button> */}
        </div>
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
    </>
  );
};

export default MatchFinanciero;
