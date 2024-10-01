"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { balance, listar,cuentasCorrientes } from "@/api/fintoc.mock";
import Tabs from "@/components/Tabs";
import SearchCard from "@/components/SearchCard";
import BreadCrumbs from "@/components/BreadCrumbs";
import SelectWithSearch from "@/components/SelectWithSearch";
import { fetchDataBalance } from "@/api/fetchDataBalance";
import BottomSheet from "@/components/BottomSheet";

const Cartolas = () => {
  const [dataBalance, setDataBalance] = useState(null);
  const [dataListar, setDataListar] = useState(null);
  const [dataTotals, setDataTotals] = useState(null);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "movimientos");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(dataListar || []);
  const [accountNumber, setAccountNumber] = useState(null);  
  const [selectedRut, setSelectedRut] = useState(null);
  const [selectedDescripcion, setSelectedDescripcion] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [filteredRutData, setFilteredRutData] = useState([]);
  const [filteredDescripcion, setFilteredDescripcion] = useState([]);
  const [filteredCuentasCorrientes, setFilteredCuentasCorrientes] = useState([]);
  const [selectedMontos, setSelectedMontos] = useState([]);
  const [selectedRutMonto, setSelectedRutMonto] = useState(null);
  const [showRut, setShowRut] = useState(true);
  const [selectedReferenceRutData, setSelectedReferenceRutData] = useState(null);
  const [selectedMontosRutData, setSelectedMontosRutData] = useState([]);
  const [selectedReferenceCuentasCorrientes, setSelectedReferenceCuentasCorrientes] = useState([]);
  const [selectedMontoCuentasCorrientes, setSelectedMontoCuentasCorrientes] = useState([]);
  const itemsPerPage = 20;

  const [expandedRut, setExpandedRut] = useState(null);
  const [expandedDescripcion, setExpandedDescripcion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

console.log("selectedRut revision", selectedRut)
console.log("filteredRutData revision", filteredRutData)
console.log("selectedReferenceCuentasCorrientes revision:", selectedReferenceCuentasCorrientes)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 1200);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const formatCurrencyMonto = (amount) => {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateResult = () => {
    const sumAmounts = selectedMontoCuentasCorrientes.reduce((acc, curr) => acc + curr, 0);
    const result = selectedMontos - sumAmounts;
    return result; // Devuelve el valor numérico sin formatear
  };
  
  const resultado = calculateResult();
  const resultadoFormateado = formatCurrencyMonto(resultado);
console.log("resultado revision:", resultado)
  useEffect(() => {
    const numero = localStorage.getItem('accountNumber');
    setAccountNumber(numero);
  }, []);
  const pages = [
    { name: 'Bancos', href: '/dashboard/matchfinanciero/', current: false },
    { name: 'Match Financiero', href: '/dashboard/matchfinanciero/cartolas?tab=movimientos', current: true } 
  ];

  const saldoInicial = dataBalance?.data?.saldos?.saldo_inicial;
  const formattedSaldoInicial = typeof saldoInicial !== 'string'
  ? parseFloat(saldoInicial?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    }).replace(/\$|CLP|\./g, ''))
  : saldoInicial?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });

  const stats =
    dataBalance && dataBalance?.data?.saldos
      ? [
          {
            name: "Saldo Inicial",
            value:`${formattedSaldoInicial}`,
            change: " ",
          },
          {
            name: "Saldo Final",
            value: dataBalance?.data?.saldos?.saldo_final.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
          {
            name: "Cargos",
            value: dataBalance?.data?.saldos?.cargos.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
          {
            name: "Abonos",
            value: dataBalance?.data?.saldos?.abonos.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
        ]
      : [];    

  const handleSearchChange = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);



  useEffect(() => {
    if (dataListar) {
      setFilteredData(dataListar);
    }
  }, [dataListar]);
  

  // const totalPages = dataListar
  //   ? Math.ceil(dataListar.length / itemsPerPage)
  //   : 0;

  // const currentData = dataListar
  //   ? dataListar.slice(
  //       (currentPage - 1) * itemsPerPage,
  //       currentPage * itemsPerPage
  //     )
  //   : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const headlines = Array.from(
  new Map(
    dataListar
      ?.filter(item => item.rut_titular && item.nombre_titular)
      .map(item => [item.rut_titular, { nombre_titular: item.nombre_titular }])
  )
).map(([rut_titular, { nombre_titular }]) => ({ rut_titular, nombre_titular }));

const UnmatchedCount = dataListar?.reduce((acc, item) => {
  if (item.estado === "Sin Conciliar") {
    if (item.rut_titular) {
      acc[item.rut_titular] = (acc[item.rut_titular] || 0) + 1;
    }
    if (item.descripcion) {
      acc[item.descripcion] = (acc[item.descripcion] || 0) + 1;
    }
  }
  return acc;
}, {});

const headlinesData = Array.from(
  new Map(
    dataListar
      ?.filter(item => item.descripcion && item.rut_titular === null && item.nombre_titular === null)
      .map(item => [item.descripcion])
  )
).map(([descripcion]) => ({ descripcion }));



const handleClickRut = (rut, monto) => {
  setSelectedRut(rut);
  setSelectedRutMonto(monto);

  const filtered = dataListar.filter(item => item.rut_titular === rut);
  const filteredCuentasCorrientes = cuentasCorrientes?.data.filter(item => item.analisis === rut);
  setFilteredRutData(filtered);
  setFilteredCuentasCorrientes(filteredCuentasCorrientes);

  // setSelectedReference(null);
  // setSelectedMontos([]);
  // setSelectedReferenceCuentasCorrientes([]);
  // setSelectedMontoCuentasCorrientes([]);
  
  // const isExpanded = expandedRut === rut;
  // setExpandedRut(isExpanded ? null : rut);
  // setIsOpen(!isExpanded);
};

const handleToggleExpand = (rut) => {
  setExpandedRut(expandedRut === rut ? null : rut);
  setSelectedReference(null);
  setSelectedMontos([]);
};


const handleClickDescripcion = (descripcion) => {
  setSelectedDescripcion(descripcion);
  const filteredDescripcion = dataListar.filter(item => item.descripcion === descripcion);
  setFilteredDescripcion(filteredDescripcion)
  setFilteredCuentasCorrientes(cuentasCorrientes.data);
  setExpandedDescripcion(expandedDescripcion === descripcion ? null : descripcion);
};

const handleCheckboxChange = (reference, monto) => {
  setSelectedReference((prevSelected) => 
    prevSelected === reference ? null : reference
  );

  setSelectedMontos((prevSelectedMontos) => {
    if (prevSelectedMontos.includes(monto)) {
      return prevSelectedMontos.filter((m) => m !== monto);
    } else {
      return [monto];
    }
  });

  setSelectedReferenceCuentasCorrientes([]);
  setSelectedMontoCuentasCorrientes([]);
};



const handleCheckboxChangeRutData = (reference, monto) => {
  setSelectedReferenceRutData((prevSelected) =>
    prevSelected === reference ? null : reference
  );

  setSelectedMontos((prevSelectedMontos) => {
    if (prevSelectedMontos.includes(monto)) {
      return prevSelectedMontos.filter((m) => m !== monto);
    } else {
      return [...prevSelectedMontos, monto];
    }
  });
};

const handleCheckboxChangeCuentasCorrientes = (reference, monto) => {
  setSelectedReferenceCuentasCorrientes((prevSelectedReferences) => {
    const newSelectedReferences = prevSelectedReferences.includes(reference)
      ? prevSelectedReferences.filter((ref) => ref !== reference)
      : [...prevSelectedReferences, reference];

    setIsBottomSheetOpen(newSelectedReferences.length > 0);

    return newSelectedReferences;
  });

  setSelectedMontoCuentasCorrientes((prevSelectedMontos) => {
    const newSelectedMontos = [...prevSelectedMontos];
    const index = newSelectedMontos.indexOf(monto);

    if (selectedReferenceCuentasCorrientes.includes(reference)) {
      if (index !== -1) {
        newSelectedMontos.splice(index, 1);
      }
    } else {
      newSelectedMontos.push(monto);
    }

    return newSelectedMontos;
  });
};

useEffect(() => {  
  console.log('headlines:', headlines);
  console.log('selectedMontos:', selectedMontos);
  console.log('selectedRutMonto:', selectedRutMonto);
  console.log('selectedReferenceCuentasCorrientes:', selectedReferenceCuentasCorrientes);
  console.log('selectedMontoCuentasCorrientes:', selectedMontoCuentasCorrientes);
  console.log('filteredCuentasCorrientes:', filteredCuentasCorrientes);

  const totalMontoCuentasCorrientes = selectedMontoCuentasCorrientes.reduce((acc, curr) => acc + curr, 0);
  const totalMonto = selectedMontos.reduce((acc, curr) => acc + curr, 0);

  if (totalMonto === totalMontoCuentasCorrientes) {
    console.log('Montos coinciden:', totalMonto);
  } else {
    console.log('Montos no coinciden');
  }
}, [selectedMontos, selectedRutMonto, selectedReferenceCuentasCorrientes, selectedMontoCuentasCorrientes ]);




  const tabs = [
    {
      name: "movimientos",
      label: "Movimientos",
      content: (
        <div>
          <SearchCard
            onSearchChange={handleSearchChange}
            dataListar={dataListar}
            setDataListar={setDataListar}
            dataBalance={dataBalance} 
            setDataBalance={setDataBalance}
            setDataTotals={setDataTotals}
          />
          {dataBalance && dataBalance?.data?.saldos && (
            <div className="mt-4">
              <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(
                  (stat) =>
                    stat.value !== undefined && (
                      <div
                        key={stat.name}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-4 sm:px-6 xl:px-8"
                      >
                        <dt className="text-sm font-medium leading-6 text-gray-500">
                          {stat.name}
                        </dt>
                        <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                          {parseFloat(stat.value).toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                          })}
                        </dd>
                      </div>
                    )
                )}
              </dl>
            </div>
          )}
          <div className="mt-6">
            <div className="container overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      R.U.T. Titular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Nombre Titular
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Referencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                      Ver detalle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredData?.length > 0
                    ? filteredData.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                    : []
                  ).map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-1 whitespace-nowrap text-gray-600 text-sm">
                        {item.fecha.split("-").reverse().join("/")}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-gray-600 text-sm">
                        {item.rut_titular}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-gray-600 text-sm">
                        {item.nombre_titular}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-gray-600 text-sm">
                        {item.descripcion}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-gray-600 text-sm">
                        {item.referencia}
                      </td>
                      <td
                        className={`px-6 py-2 whitespace-nowrap text-sm ${
                          parseInt(item.monto) < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {parseInt(item.monto) < 0
                          ? `(${Math.abs(parseInt(item.monto)).toLocaleString(
                              "es-CL",
                              { style: "currency", currency: "CLP" }
                            )})`
                          : Math.abs(parseInt(item.monto)).toLocaleString(
                              "es-CL",
                              { style: "currency", currency: "CLP" }
                            )}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`
                          inline-block px-3 py-1 
                          text-xs font-medium 
                          rounded-full 
                          ${
                            item.estado === "activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        `}
                        >
                          {item.estado === "Sin Conciliar"
                            ? "Sin Match"
                            : item.estado}
                        </span>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm"></td>
                    </tr>
                  ))}
                  {filteredData?.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        // className="px-6 py-4 text-center text-gray-500"
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-4 text-center text-gray-500"
                      >
                        No se encontraron resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredData?.length)} de{" "}
                {filteredData?.length} registros
              </span>
            </div>
            <div className="flex flex-col items-center md:inline-flex md:-space-x-px">
              {filteredData && filteredData.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    aria-label="Anterior"
                  >
                    Anterior
                  </button>
                  {[
                    ...Array(Math.ceil(filteredData.length / itemsPerPage)),
                  ].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                      ${
                        currentPage === index + 1
                          ? "bg-white border-gray-400 text-black shadow-md"
                          : "bg-white text-gray-500"
                      }`}
                      aria-label={`Página ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredData.length / itemsPerPage)
                    }
                    className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    aria-label="Próximo"
                  >
                    Próximo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "match",
      label: "Match Financieros",
      content: (
        <div className="flex w-full mt-4">
          <div className="p-4 flex flex-col items-start justify-start" style={{ width: isMobile ? '100%' : '35%' }}>
            {showRut ? (
              headlines?.map(({ rut_titular, nombre_titular }) => (
                <div
                  className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white ${selectedRut === rut_titular ? 'border-customGreen' : 'border-gray-200 hover:border-gray-300'} ${selectedRut && selectedRut !== rut_titular ? 'opacity-50' : ''}`}
                  key={rut_titular}
                  onClick={() => handleClickRut(rut_titular)}
                >
                  <div className="flex items-start w-full">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-customGreen">
                      <span className="font-medium leading-none text-white">{nombre_titular.substring(0, 2)}</span>
                    </span>
                    <div className="ml-2">
                      <div>{nombre_titular}</div>
                      <div className="text-md text-gray-600">{rut_titular}</div>
                    </div>
                    <svg
                      className={`w-4 h-4 ml-auto transform ${expandedRut === rut_titular ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => handleToggleExpand(rut_titular)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  <p className="text-red-500 ml-12 mt-1">Movimientos sin match: {UnmatchedCount[rut_titular] || 0}</p>

                  {expandedRut === rut_titular && (
                    <div className="mt-2">                      
                        <div className="flex-1">
                          {showRut ? (
                            filteredRutData?.map((item, index) => (
                              <div
                                key={index}
                                className={`mb-2 p-4 border-2 rounded-xl w-full flex flex-col ${
                                  selectedReference === index
                                    ? 'border-customGreen bg-customBackgroundGreen'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${selectedReference !== null && selectedReference !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleCheckboxChange(index, item.monto)}
                              >
                                {isMobile ? (
                                  <div className="flex flex-col">
                                    <p ><strong className="text-md text-gray-500">Monto:</strong> {formatCurrencyMonto(item.monto)}</p>
                                    <p><strong className="text-md text-gray-500">Fecha:</strong> {item.fecha}</p>
                                    <p><strong className="text-md text-gray-500">Referencia:</strong> {item.referencia}</p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex  justify-between">
                                      <div className="flex flex-col items-start mb-2">
                                        <p>$ {formatCurrencyMonto(item.monto)}</p>
                                        <p className="text-md text-gray-600">Monto</p>
                                      </div>
                                      <div className="flex flex-col items-start mb-2">
                                        <p>{formatDate(item.fecha)}</p>
                                        <p className="text-md text-gray-600">Fecha de emisión</p>
                                      </div>
                                      <div className="flex flex-col items-start">
                                        <p>{item.referencia}</p>
                                        <p className="text-md text-gray-600">Referencia</p>
                                      </div>
                                    </div>
                                  </>
                                )}

                              </div>
                            ))
                          ) : (
                            filteredDescripcion?.map((item, index) => (
                              <div
                                key={index}
                                className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white flex justify-between items-center ${
                                  selectedReferenceRutData === item.referencia
                                    ? 'border-customGreen'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${selectedReferenceRutData && selectedReferenceRutData !== item.referencia ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleCheckboxChangeRutData(item.referencia, item.monto)}
                              >
                                <div>
                                  <p><strong>Monto:</strong> {item.monto}</p>
                                  <p><strong>Fecha:</strong> {item.fecha}</p>
                                  <p><strong>Referencia:</strong> {item.referencia}</p>
                                  <p><strong>Rut:</strong> {item.rut_titular}</p>
                                  <p><strong>Nombre:</strong> {item.nombre_titular}</p>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={selectedReferenceRutData === item.referencia}
                                  className="form-checkbox text-customGreen"
                                  disabled={selectedReferenceRutData && selectedReferenceRutData !== item.referencia}
                                />
                              </div>
                            ))
                          )}
                        </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              headlinesData?.map(({ descripcion, estado }) => (
                <div
                  className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white ${selectedDescripcion === descripcion ? 'border-customGreen' : 'border-gray-200 hover:border-gray-300'}`}
                  key={descripcion}
                  onClick={() => handleClickDescripcion(descripcion)}
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="font-bold">{descripcion}</div>
                      <div>{estado}</div>
                    </div>
                    <svg className={`w-4 h-4 transform ${expandedDescripcion === descripcion ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  <p className="text-red-500 mt-2">Movimientos sin match: {UnmatchedCount[descripcion] || 0}</p>
                  {expandedDescripcion === descripcion && (
                    <div className="mt-2">                      
                      <div className="p-2 bg-gray-200 rounded-lg">Card 1</div>
                      <div className="p-2 bg-gray-200 rounded-lg mt-2">Card 2</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* <div className="flex-1 bg-gray-200 p-4">
            {showRut ? (
              filteredRutData?.map((item, index) => (
                <div
                  key={index}
                  className={`mb-2 p-4 border-2 rounded-lg  w-full bg-white flex justify-between items-center ${
                    selectedReference === index
                      ? 'border-customGreen'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedReference !== null && selectedReference !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCheckboxChange(index, item.monto)}
                >
                  <div>
                    <p><strong>Monto:</strong> {formatCurrencyMonto(item.monto)}</p>
                    <p><strong>Fecha:</strong> {item.fecha}</p>
                    <p><strong>Referencia:</strong> {item.referencia}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedReference === index}
                    className="form-checkbox text-customGreen cursor-pointer"
                    disabled={selectedReference !== null && selectedReference !== index}
                    onChange={() => handleCheckboxChange(index, item.monto)} 
                  />
                </div>
              ))
            ) : (
              filteredDescripcion?.map((item, index) => (
                <div
                  key={index}
                  className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white flex justify-between items-center ${
                    selectedReferenceRutData === item.referencia
                      ? 'border-customGreen'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${selectedReferenceRutData && selectedReferenceRutData !== item.referencia ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleCheckboxChangeRutData(item.referencia, item.monto)}
                >
                  <div>
                    <p><strong>Monto:</strong> {item.monto}</p>
                    <p><strong>Fecha:</strong> {item.fecha}</p>
                    <p><strong>Referencia:</strong> {item.referencia}</p>
                    <p><strong>Rut:</strong> {item.rut_titular}</p>
                    <p><strong>Nombre:</strong> {item.nombre_titular}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedReferenceRutData === item.referencia}
                    className="form-checkbox text-customGreen"
                    disabled={selectedReferenceRutData && selectedReferenceRutData !== item.referencia}
                  />
                </div>
              ))
            )}
          </div> */}

          {/* <div className="bg-gray-300 p-4" style={{ width: '65%' }}>
            {selectedMontos > 0 && filteredCuentasCorrientes?.map((item, index) => (
              <div 
                key={index} 
                className={`mb-2 p-4 border-2 rounded-lg w-full bg-white flex justify-between items-center ${
                  selectedReferenceCuentasCorrientes.includes(item.referencia_his)
                    ? 'border-customGreen'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                // onClick={() => handleCheckboxChangeCuentasCorrientes(item.referencia_his, item.valor_moneda_nacional)}
              >
                <div>
                  <p><strong>Cuenta:</strong> {item.codigo_plan_de_cuentas}</p>
                  <p><strong>Monto:</strong> {formatCurrencyMonto(item.valor_moneda_nacional)}</p>
                  <p><strong>Fecha:</strong> {item.fecha_comprobante_his}</p>
                  <p><strong>Referencia:</strong> {item.referencia_his}</p>
                  <p><strong>Glosa:</strong> {item.glosa_detalle_compte_his}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedReferenceCuentasCorrientes.includes(item.referencia_his)}
                  onChange={() => handleCheckboxChangeCuentasCorrientes(item.referencia_his, item.valor_moneda_nacional)}
                  className="form-checkbox text-customGreen cursor-pointer"
                />
              </div>          
            ))}
          </div> */}

          <div className="bg-gray-300 p-4" style={{ width: isMobile ? '100%' : '65%' }}>
            {selectedMontos > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-customBackgroundGreen">
                      <th className="p-2 text-left pl-6"></th>
                      <th className="p-2 text-left">Cuenta</th>
                      <th className="p-2 text-left">Monto</th>
                      <th className="p-2 text-left">Fecha</th>
                      <th className="p-2 text-left">Referencia</th>
                      <th className="p-2 text-left">Glosa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCuentasCorrientes?.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedReferenceCuentasCorrientes.includes(item.referencia_his)}
                            onChange={() => handleCheckboxChangeCuentasCorrientes(item.referencia_his, item.valor_moneda_nacional)}
                            className="form-checkbox text-customGreen cursor-pointer"
                          />
                        </td>
                        <td className="p-2">{item.codigo_plan_de_cuentas}</td>
                        <td className="p-2">$ {formatCurrencyMonto(item.valor_moneda_nacional)}</td>
                        <td className="p-2">{formatDate(item.fecha_comprobante_his)}</td>
                        <td className="p-2">{item.referencia_his}</td>
                        <td className="p-2">{item.glosa_detalle_compte_his}</td>                        
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-100 p-4 shadow-md flex justify-end">
                  <span className="font-bold mr-4">Diferencia:</span>  $ {resultadoFormateado}
                </div>
              </div>
            )}
            {resultado === 0 && selectedReferenceCuentasCorrientes.length > 0 && (
              <div className="flex justify-end">
                <button className="bg-customGreen text-white py-2 px-4 rounded mt-4 mr-4">
                  Match
                </button>
              </div>
            )}
          </div>

          
        </div>
      ),
    },
    {
      name: "anular",
      label: "Anular Movimientos",
      content: <div>Contenido de Anular Movimientos</div>,
    },
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };


  const formatCurrency = (number) => {
    if (isNaN(number)) {
      return '$0';
    }
    const formattedNumber = Math.abs(number).toLocaleString('es-CL');
    return '$' + formattedNumber;
  };
 
  const totales = dataTotals?.totales;
  console.log("dataTotals revision:", dataTotals)
  const totalCargos = totales && totales.length > 0 
    ? totales.reduce((acc, curr) => acc + parseFloat(curr["$ - CLP"].total_cargos || 0), 0) 
    : "N/A";

  const totalAbonos = totales && totales.length > 0 
    ? totales.reduce((acc, curr) => acc + parseFloat(curr["$ - CLP"].total_abonos || 0), 0) 
    : "N/A";

  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    const year = date.getFullYear();
    return `${capitalizedMonth} ${year}`;
  };

  return (
    <div className="container md:w-1/1 md:px-16">
      <BreadCrumbs pages={pages} />
      <SelectWithSearch dataListar={dataListar} accountNumber={accountNumber} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="card bg-white p-4 rounded shadow">
          <div className="text-lg font-semibold">{getCurrentMonthYear()}</div>
          <div className="text-sm text-gray-500">Periodo</div>
        </div>
        <div className="card bg-white p-4 rounded shadow">
          <div className="text-lg font-semibold">{formatCurrency(totalCargos)}</div>
          <div className="text-sm text-gray-500">Cargos</div>
        </div>
        <div className="card bg-white p-4 rounded shadow">
          <div className="text-lg font-semibold">{formatCurrency(totalAbonos)}</div>
          <div className="text-sm text-gray-500">Abonos</div>
        </div>
      </div>
      <Tabs tabs={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
      <div>{tabs.find((tab) => tab.name === activeTab)?.content}</div>      
      {/* {selectedReferenceCuentasCorrientes.length > 0 && (
        <BottomSheet isOpen={isBottomSheetOpen} onClose={toggleBottomSheet}>
          <p>Monto: {formatCurrencyMonto(selectedMontos)}</p>
          {selectedMontoCuentasCorrientes.map((monto, index) => (
            <p key={index}>Monto INET: {formatCurrencyMonto(monto)}</p>
          ))}
          <p>Diferencia: {resultadoFormateado}</p>
          {resultado === 0 && (
            <button className="bg-customGreen text-white py-2 px-4 rounded">
              Match
            </button>
          )}
        </BottomSheet>
      )} */}
    </div>
  );
};

export default Cartolas;