"use client";

import React, { useState, useEffect } from 'react';
import { getFintoc } from '@fintoc/fintoc-js';

const MatchFinanciero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [holderType, setHolderType] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [widget, setWidget] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (holderType && isClient) {
      initializeWidget(holderType);
    }
  }, [holderType, isClient]);

  const initializeWidget = async (type) => {
    const product = 'movements';
    const publicKey = 'pk_live_1mLo7fccgUhV2TEYfzonwnEywbEbZzxv';
    const domain = window.location.hostname;
    const webhookUrl = `https://webhook.site/b3195938-0cbb-4832-afe4-52e82d8dc278`;

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
          console.log('Response',res)
          console.log('Fintoc success');
        },
        onExit: (res) => {
          console.log("Exit",res)
          console.log('Fintoc exit');
        },
      });
      setWidget(newWidget);
      newWidget.open();
      setIsOpen(false);
    } catch (error) {
      console.error('Error initializing Fintoc widget:', error);
    }
  };

  const handleOptionClick = (type) => {
    console.log('holderType:', type);
    setHolderType(type);
  };

  const handleClose = () => {
    if (widget) {
      widget.destroy();
      setWidget(null);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setIsOpen(true)}
      >
        Match
      </button>

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
                onClick={() => handleOptionClick('individual')}
              >
                <h3 className="font-bold">Persona</h3>
                <p>Disponible para: Banco BICE, BCI, Itaú, Scotiabank, Banco Estado, Banco de Chile, Santander.</p>
              </div>
              <div
                className="bg-gray-100 p-4 rounded mb-4 cursor-pointer"
                onClick={() => handleOptionClick('business')}
              >
                <h3 className="font-bold">Empresa</h3>
                <p>Disponible para: Banco BICE, BCI, Itaú, Scotiabank, Banco Estado, Banco de Chile, Santander, 360 Connect, Security.</p>
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
