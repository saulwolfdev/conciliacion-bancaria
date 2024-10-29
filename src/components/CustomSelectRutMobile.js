'use client';
import { useState } from 'react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const CustomSelectRutMobile = ({ headlines, handleClickRut, setIsOptionSelected, UnmatchedCount }) => {
  const placeholder = { nombre_titular: 'Seleccionar Rut', rut_titular: '' };
  const [selected, setSelected] = useState(placeholder);

  const handleSelectionChange = (item) => {
    setSelected(item);
    handleClickRut(item.rut_titular);
    if (item.rut_titular !== '') {
      setIsOptionSelected(1);
    }
  };

  return (
    <Listbox value={selected} onChange={handleSelectionChange}>
      <Label className="block text-sm font-medium leading-6 font-bold text-[#525252] ml-2">Seleccionar Rut</Label>
      <div className="relative mt-2 w-full">
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-customGreen sm:text-sm sm:leading-6">
          <span className="inline-flex w-full truncate">
            <span className="truncate">{selected.nombre_titular}</span>
            <span className="ml-2 truncate text-gray-500">{selected.rut_titular}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            key="placeholder"
            value={placeholder}
            disabled
            className="cursor-not-allowed text-gray-400 ml-2"
          >
            {placeholder.nombre_titular}
          </ListboxOption>
          {headlines.map((item) => (
            <div key={item.rut_titular}>
              <ListboxOption
                value={item}
                className={({ active }) => `
                  relative cursor-default select-none py-2 pl-3 pr-9
                  ${active ? 'bg-customGreen text-white' : 'text-gray-900'}
                `}
              >
                <div className="flex flex-col">
                  <span className="truncate font-normal">Nombre:  {item.nombre_titular}</span>
                  <span className="truncate text-gray-500">Rut: {item.rut_titular}</span>
                  <span className="truncate text-gray-500">Sin Match: {UnmatchedCount[item.rut_titular] || 0}</span>
                </div>
                {selected.rut_titular === item.rut_titular && item.rut_titular !== '' && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-red">
                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                )}
              </ListboxOption>
              {/* Línea separadora */}
              <hr className="border-t border-gray-200 my-1" />
            </div>
          ))}
        </ListboxOptions>
      </div>      
    </Listbox>
  );
};

export default CustomSelectRutMobile;
