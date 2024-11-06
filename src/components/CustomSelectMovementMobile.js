'use client';
import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const CustomSelectMovementMobile = ({ filteredRutData, handleCheckboxChange, formatCurrencyMonto, formatDate, isOptionSelected }) => {
  const placeholder = { monto: '', fecha: '', referencia: '', label: 'Seleccionar...' };
  const [selected, setSelected] = useState(placeholder);

  const handleSelectionChange = (item) => {
    setSelected(item);
  };

  const isDisabled = isOptionSelected === 0;

  return (
    <Listbox
      value={selected}
      onChange={(item) => handleSelectionChange(item)}
      disabled={isDisabled}
    >
      <Listbox.Label className={`block text-md font-medium leading-6 font-bold ${isDisabled ? 'text-gray-400' : 'text-[#525252]'} mt-4`}>
        Seleccionar un Movimiento
      </Listbox.Label>
      <div className={`w-full ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Listbox.Button
          className={`relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-customGreen sm:text-sm sm:leading-6 ${isDisabled ? 'cursor-not-allowed' : ''}`}
        >
          <span className="inline-flex w-full truncate">
            <span className="truncate">
              {selected.label ? selected.label : `$ ${formatCurrencyMonto(selected.monto)}`}
            </span>
            <span className="ml-2 truncate text-gray-500">
              {selected.fecha ? selected.fecha.split("-").reverse().join("/") : ''}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <Listbox.Option
              key="placeholder"
              value={placeholder}
              disabled
              className="cursor-not-allowed text-gray-400 ml-2"
            >
              {placeholder.label}
            </Listbox.Option>

            {filteredRutData.map((item, index) => (
              <div key={index}>
                <Listbox.Option
                  value={item}
                  onClick={(event) => handleCheckboxChange(index, item.monto, item, event)}
                  className={({ active }) => `
                    relative cursor-default select-none py-2 pl-3 pr-9
                    ${active ? 'bg-customBackgroundGreen text-white' : 'text-gray-900'}
                  `}
                >
                  <div className="flex flex-col">
                    <span className="truncate text-gray-500">Monto: $ {formatCurrencyMonto(item.monto)}</span>
                    <span className="truncate text-gray-500"> Fecha: {item.fecha.split("-").reverse().join("/")}</span>
                    <span className="truncate text-gray-500">Referencia: {item.referencia}</span>
                  </div>
                  {selected.monto === item.monto && item.monto !== '' && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                      <CheckIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  )}
                </Listbox.Option>
                {index < filteredRutData.length - 1 && (
                  <hr className="border-t border-gray-200 my-1" />
                )}
              </div>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default CustomSelectMovementMobile;
