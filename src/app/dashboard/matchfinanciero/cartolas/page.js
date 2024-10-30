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
import SearchBar from '@/components/SearchBar';
import SelectBar from '@/components/SelectBar';
import DateSearchBar from '@/components/DateSearchBar';
import CustomModal from '@/components/CustomModal';
import CustomSelectRutMobile from '@/components/CustomSelectRutMobile';
import CustomSelectMovementMobile from '@/components/CustomSelectMovementMobile';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

const Cartolas = () => {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [dataBalance, setDataBalance] = useState(null);
  const [dataListar, setDataListar] = useState(null);
  const [dataTotals, setDataTotals] = useState(null);
  const [activeTab, setActiveTab] = useState(tabFromUrl || "movimientos");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(dataListar || []);
  const [accountNumber, setAccountNumber] = useState(null);  
  const [selectedRut, setSelectedRut] = useState(null);
  const [selectedDescripcion, setSelectedDescripcion] = useState(null);
  const [selectedReference, setSelectedReference] = useState(null);
  const [filteredRutData, setFilteredRutData] = useState([]);
  const [filteredDescripcion, setFilteredDescripcion] = useState([]);
  const [cuentasCorrientesData, setCuentasCorrientesData] = useState(cuentasCorrientes);
  const [filteredCuentasCorrientes, setFilteredCuentasCorrientes] = useState([]);
  const [selectFilteredCuentasCorrientes, setSelectFilteredCuentasCorrientes] = useState([]);
  const [filteredCuentasCorrientesByRut, setFilteredCuentasCorrientesByRut] = useState([]);
  const [selectedMontos, setSelectedMontos] = useState([]);
  const [selectedRutMonto, setSelectedRutMonto] = useState(null);
  const [showRut, setShowRut] = useState(true);
  const [selectedReferenceRutData, setSelectedReferenceRutData] = useState(null);
  const [selectedMontosRutData, setSelectedMontosRutData] = useState([]);
  const [selectedReferenceCuentasCorrientes, setSelectedReferenceCuentasCorrientes] = useState([]);
  const [selectedMontoCuentasCorrientes, setSelectedMontoCuentasCorrientes] = useState([]);
  const itemsPerPage = 15;

  const [expandedRut, setExpandedRut] = useState(null);
  const [expandedDescripcion, setExpandedDescripcion] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectIsMobile, setSelectIsMobile] = useState(false);
  const [modalIsMobile, setModalIsMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ startDate: null, endDate: null });
  const [filteredMatchedCuentasCorrientes, setFilteredMatchedCuentasCorrientes] = useState([]); 
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(true)
  const [isOptionSelected, setIsOptionSelected] = useState(0);
  const maxVisiblePages = 5;

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  let withoutMatch = (dataListar) => {
    if (dataListar) {
      return dataListar?.filter(item => item.estado === "Sin Conciliar").length;;
    } 
  }
console.log("contarSinConciliar", withoutMatch(dataListar))
console.log("dataListar", dataListar)

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  

  useEffect(() => {
    const matchedCuentas = filteredCuentasCorrientes.filter(cuenta =>
      selectedReferenceCuentasCorrientes.includes(cuenta.referencia_his)
    );
    setFilteredMatchedCuentasCorrientes(matchedCuentas);
  }, [selectedReferenceCuentasCorrientes, filteredCuentasCorrientes]);
console.log("filteredMatchedCuentasCorrientes", filteredMatchedCuentasCorrientes)
  
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1670);
    setSelectIsMobile(window.innerWidth < 1450);
    setModalIsMobile(window.innerWidth < 450)
  };

  if (typeof window !== "undefined") {
    setIsMobile(window.innerWidth < 1670);
    setSelectIsMobile(window.innerWidth < 1450);
    setModalIsMobile(window.innerWidth < 450)
    window.addEventListener("resize", handleResize);
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
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
    return result;
  };
  
  const resultado = calculateResult();
  const resultadoFormateado = formatCurrencyMonto(resultado);

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
      
      
        const handleSearchs = (searchTerm) => {
          if (typeof searchTerm !== 'string') {
            console.error("searchTerm no es una cadena de texto");
            return;
          }
        
          const lowercasedTerm = searchTerm.toLowerCase();
          if (Array.isArray(filteredCuentasCorrientesByRut)) {
            const filtered = filteredCuentasCorrientesByRut.filter((item) => {
              const formattedDate = formatDate(item.fecha_comprobante_his).toLowerCase();
              return (
                item.codigo_plan_de_cuentas?.toLowerCase().includes(lowercasedTerm) ||
                item.valor_moneda_nacional?.toString().includes(lowercasedTerm) ||
                formattedDate.includes(lowercasedTerm) ||
                item.referencia_his?.toLowerCase().includes(lowercasedTerm) ||
                item.glosa_detalle_compte_his?.toLowerCase().includes(lowercasedTerm)
              );
            });
            setFilteredCuentasCorrientes(filtered);
          } else {
            console.error("filteredCuentasCorrientesByRut no es un array");
          }
        };


      const handleSelect = (selectedOption) => {
        if (selectedOption === "all") {
          setFilteredCuentasCorrientes(filteredCuentasCorrientesByRut);
        } else if (typeof selectedOption === 'string') {
          const filtered = filteredCuentasCorrientesByRut.filter((item) =>
            item.glosa_detalle_compte_his?.toLowerCase() === selectedOption.toLowerCase()
          );
          setFilteredCuentasCorrientes(filtered);
        } else {
          console.error("selectedOption no es una cadena de texto");
        }
      };
      
      const uniqueOptions = [...new Set(filteredCuentasCorrientesByRut.map(item => item.glosa_detalle_compte_his))];



      const handleDateChange = (dateRange) => {
        if (Array.isArray(filteredCuentasCorrientesByRut)) {
          if (!dateRange.startDate && !dateRange.endDate) {            
            setFilteredCuentasCorrientes(filteredCuentasCorrientesByRut);
          } else {
            const startDate = new Date(dateRange.startDate);
            startDate.setHours(0, 0, 0, 0); 
            const endDate = new Date(dateRange.endDate);
            endDate.setHours(23, 59, 59, 999);
    
            const filtered = filteredCuentasCorrientesByRut.filter((item) => {
              const itemDate = new Date(item.fecha_comprobante_his);
              return itemDate >= startDate && itemDate <= endDate;
            });
    
            setFilteredCuentasCorrientes(filtered);
          }
        } else {
          console.error("filteredCuentasCorrientesByRut no es un array");
        }
      };


      const handleDateReset = () => {
        // setDateRange({ startDate: null, endDate: null });
        setSelectedDateRange({ startDate: null, endDate: null });
        setFilteredCuentasCorrientes(filteredCuentasCorrientesByRut);
      };
      
      const handleSearch = (filteredDatas) => {
        setFilteredCuentasCorrientes(filteredDatas || filteredCuentasCorrientes);
      };

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
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1)
  );
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);


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
  const filterCuentasCorrientes = Array.isArray(cuentasCorrientesData?.data) 
    ? cuentasCorrientesData.data.filter(item => item.analisis === rut) 
    : [];
  
  setFilteredRutData(filtered);
  setFilteredCuentasCorrientes(filterCuentasCorrientes);
  setSelectFilteredCuentasCorrientes(filterCuentasCorrientes);
  setFilteredCuentasCorrientesByRut(filterCuentasCorrientes);
  setExpandedRut(expandedRut === rut ? null : rut);
  setSelectedReference(null);  
  setIsClicked(false);
  setSelectedMontoCuentasCorrientes([]);
  setSelectedReferenceCuentasCorrientes([]);
  setSelectedMontos([]);
  setSelectedOption('');
};



const handleToggleExpand = (rut) => {
  setExpandedRut(expandedRut === rut ? null : rut);
  setSelectedReference(null);
  setSelectedMontos([]);
  setFilteredRutData([])
};


const handleClickDescripcion = (descripcion) => {
  setSelectedDescripcion(descripcion);
  const filteredDescripcion = dataListar.filter(item => item.descripcion === descripcion);
  setFilteredDescripcion(filteredDescripcion)
  setFilteredCuentasCorrientes(cuentasCorrientes.data);
  setExpandedDescripcion(expandedDescripcion === descripcion ? null : descripcion);
};

const handleCheckboxChange = (reference, monto, item, event) => {
  event.stopPropagation();
  setIsClicked(true);
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

  setSelectedItem((prevSelectedItem) => 
    prevSelectedItem?.reference === reference ? null : item
  );

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
}, [selectedMontos, selectedRutMonto, selectedReferenceCuentasCorrientes, selectedMontoCuentasCorrientes,filteredCuentasCorrientes ]);


console.log("filteredCuentasCorrientes", filteredCuentasCorrientes?.length)
console.log("filteredCuentasCorrientesByRut", filteredCuentasCorrientesByRut)

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
          <div className="container overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-customBackgroundGreen">
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">R.U.T. Titular</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nombre Titular</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Descripción</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Referencia</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Monto</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                  {/* <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ver detalle</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(filteredData?.length > 0
                  ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  : []
                ).map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.fecha.split("-").reverse().join("/")}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.rut_titular}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.nombre_titular}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.descripcion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.referencia}
                    </td>
                    <td
                      className={`px-3 py-2 whitespace-nowrap text-sm ${
                        parseInt(item.monto) < 0 ? "text-red-500" : "text-customGreen"
                      }`}
                    >
                      {parseInt(item.monto) < 0
                        ? `(${Math.abs(parseInt(item.monto)).toLocaleString("es-CL", { style: "currency", currency: "CLP" })})`
                        : Math.abs(parseInt(item.monto)).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-left">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          item.estado === "activo"
                            ? "bg-customBackgroundGreen text-customGreen ring-1 ring-inset ring-green-600/20"
                            : "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20"
                        }`}
                      >
                        {item.estado === "Sin Conciliar" ? "Sin Match" : item.estado}
                      </span>
                    </td>
                    {/* <td className="px-3 py-2 whitespace-nowrap text-sm"></td> */}
                  </tr>
                ))}
                {filteredData?.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

        {/* Mapea solo las páginas dentro del rango visible */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
              ${currentPage === page ? "bg-white border-gray-400 text-black shadow-md" : "bg-white text-gray-500"}`}
              aria-label={`Página ${page}`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <div className="md:col-span-1">
          <div className="card bg-white shadow-md rounded-lg pt-0 mt-4 max-h-[740px] overflow-y-auto">
            <div className="w-full p-4 flex flex-col items-start justify-start">
              <p className="text-xl mt-1 font-bold text-[#525252]">Movimientos Bancarios</p>
              <p className="text-xs text-red-500 mt-1">Movimientos totales sin match: {withoutMatch(dataListar)}</p>
            </div>
          <div className="w-full p-4 flex flex-col items-start justify-start" style={{ width: isMobile ? '100%' : '100%' }}>
          {selectIsMobile ? (
              <div className="w-full min-h-[220px]">
                <CustomSelectRutMobile 
                  headlines={headlines} 
                  handleClickRut={handleClickRut}
                  setIsOptionSelected={setIsOptionSelected}
                  UnmatchedCount={UnmatchedCount}
                />
                <CustomSelectMovementMobile 
                  filteredRutData={filteredRutData} 
                  handleCheckboxChange={handleCheckboxChange} 
                  formatCurrencyMonto={formatCurrencyMonto}
                  formatDate={formatDate} 
                  isOptionSelected={isOptionSelected} 
                />
              </div>
            ) : (
              showRut ? (
                headlines?.map(({ rut_titular, nombre_titular }) => (                
                  <div
                    key={rut_titular}
                    className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white ${
                      selectedRut === rut_titular ? 'shadow-xl' : 'border-gray-200 hover:border-gray-300'
                    } ${selectedRut && selectedRut !== rut_titular ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-start w-full" onClick={() => handleClickRut(rut_titular)}>
                      <div className="flex w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">                    
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-customGreen">
                              <span className="font-medium leading-none text-white">{nombre_titular.substring(0, 2)}</span>
                            </span>
                            <div className="flex flex-col">
                              <div className="text-md font-bold text-[#525252] ">{nombre_titular}</div>
                              <div className="text-sm text-gray-500 text-left">{rut_titular}</div>
                            </div>
                          </div>                  
                        </div>

                        <svg
                          className={`w-4 h-4 ml-auto mt-1 transform ${expandedRut === rut_titular ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <p onClick={() => handleClickRut(rut_titular)} className="text-red-500 ml-10">Movimientos sin match: {UnmatchedCount[rut_titular] || 0}</p>

                    {expandedRut === rut_titular && (
                      <div className="mt-2">                      
                        <div className="flex-1">
                          {showRut ? (
                            filteredRutData?.map((item, index) => (
                              <div
                                key={index}
                                className={`mb-2 p-4 border-2 rounded-xl w-full flex flex-col ${
                                  selectedReference === index
                                    ? 'bg-customBackgroundGreen'
                                    : 'border-gray-200 hover:border-gray-300'
                                } ${selectedReference !== null && selectedReference !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={(event) => handleCheckboxChange(index, item.monto, item, event)}
                              >
                                {isMobile ? (
                                  <div className="flex flex-col">
                                    <div className="flex items-center">
                                      <p className={item.monto >= 0 ? "text-customGreen font-medium text-sm flex items-center" : "text-red-500 font-medium text-sm flex items-center"}>
                                        {item.monto >= 0 ? (
                                          <>
                                            <ArrowTrendingUpIcon className="w-4 h-4 text-customGreen" />
                                            <span className="text-sm font-medium text-customGreen ml-1">Abono</span>
                                          </>
                                        ) : (
                                          <>
                                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                                            <span className="text-sm font-medium text-red-500 ml-1">Cargo</span>
                                          </>
                                        )}
                                        <span className="ml-2">$ {formatCurrencyMonto(item.monto)}</span>
                                      </p>
                                    </div>

                                    <div className="flex items-center">
                                      <p className="text-xs text-gray-500 mr-2">Fecha:</p>
                                      <p className="text-sm font-medium text-gray-900">{formatDate(item.fecha)}</p>
                                    </div>
                                    <div className="flex items-center">
                                      <p className="text-xs text-gray-500 mr-2">Referencia:</p>
                                      <p className="text-sm font-medium text-gray-900">{item.referencia}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between">
                                      <div className="flex flex-col items-start">
                                        <p className={item.monto >= 0 ? "text-customGreen font-medium text-sm" : "text-red-500 font-medium text-sm"}>
                                          $ {formatCurrencyMonto(item.monto)}
                                        </p>
                                        {item.monto >= 0 ? (
                                          <div className="flex items-center">
                                            <ArrowTrendingUpIcon className="w-4 h-4 text-customGreen" />
                                            <p className="text-sm font-medium text-customGreen ml-1">Abono</p>
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
                                            <p className="text-sm font-medium text-red-500 ml-1">Cargo</p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-start">
                                        <p className="text-sm font-medium text-gray-900">{formatDate(item.fecha)}</p>
                                        <p className="text-xs text-gray-500">Fecha de emisión</p>
                                      </div>
                                      <div className="flex flex-col items-start">
                                        <p className="text-sm font-medium text-gray-900">{item.referencia}</p>
                                        <p className="text-xs text-gray-500">Referencia</p>
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
                    key={descripcion}
                    className={`mb-2 p-4 border-2 rounded-lg cursor-pointer w-full bg-white ${
                      selectedDescripcion === descripcion ? 'border-customGreen' : 'border-gray-200 hover:border-gray-300'
                    }`}
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
                    )
                  )}

          </div>
          </div>
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

        <div className="md:col-span-2 mt-4">          
            {selectFilteredCuentasCorrientes.length === 0 ? (
              <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center h-[740px] text-center">
              <img src="/images/amico.png" alt="Nada por acá" className="w-80 h-80" />
              <p className="text-xl font-bold text-[#525252] mt-12">No hay elementos para hacer match</p>
              <p className="text-md text-[#939393] mt-2">Selecciona un movimiento bancario para empezar a conciliar</p>
            </div>
            
            ) : (
              <div className="bg-white rounded-lg p-4">
                <p className="text-xl mt-1 font-bold text-[#525252]">Movimientos INET</p>
                {isClicked && selectedMontos > 0 && (
                  <div className="w-full mx-auto bg-customBackgroundGray rounded-lg overflow-hidden p-4 mb-4 mt-4">
                    {selectedItem && (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-customGreen">
                              <span className="font-medium leading-none text-white">
                                {selectedItem.nombre_titular.substring(0, 2)}
                              </span>
                            </span>
                            <div className="flex flex-col">
                              <div className={`${modalIsMobile ? 'text-sm' : 'text-md'}  font-bold text-[#525252]`}>
                                {selectedItem.nombre_titular}
                              </div>
                              <div className="text-sm text-[#939393]">
                                {selectedItem.rut_titular}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-4 items-center">
                          <div className="flex flex-col items-start">
                            <div
                              className={
                                selectedItem.monto >= 0
                                  ? `text-customGreen font-bold ${modalIsMobile ? 'text-xs' : 'text-md'}`
                                  : "text-red-500 font-bold text-md"
                              }
                            >
                              $ {formatCurrencyMonto(selectedItem.monto)}
                            </div>
                            <div className="flex items-center mt-1">
                              {selectedItem.monto >= 0 ? (
                                <>
                                  <ArrowTrendingUpIcon className="w-3 h-3 text-customGreen" />
                                  <p className="text-xs text-customGreen ml-1">Abono</p>
                                </>
                              ) : (
                                <>
                                  <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                                  <p className="text-xs text-red-500 ml-1">Cargo</p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold text-[#525252]"> {modalIsMobile ? 'Emisión' : 'Fecha de emisión'}</div>
                            <div className="text-sm text-[#939393]">{formatDate(selectedItem.fecha)}</div>
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold text-[#525252]">Referencia</div>
                            <div className="text-sm text-[#939393]">{selectedItem.referencia}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="text-md font-bold text-[#525252] mt-4">Movimientos Boletas/Facturas</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <SearchBar
                    label="Búsqueda libre"
                    onSearch={handleSearchs}
                    inputId="search-input"
                    setSelectedOption={setSelectedOption}
                    handleDateReset={handleDateReset}
                  />
                  <SelectBar
                    label="Buscar Cliente/Proveedor"
                    options={uniqueOptions}
                    onSelect={handleSelect}
                    inputId="select-input"
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    handleDateReset={handleDateReset}
                  />
                  <DateSearchBar
                    label="Buscar por fecha"
                    onDateChange={handleDateChange}
                    inputId="date-search-input"
                    setSelectedOption={setSelectedOption}
                    selectedDateRange={selectedDateRange}
                    setSelectedDateRange={setSelectedDateRange}
                  />
                </div>
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-customBackgroundGreen">
                        <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"></th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cuenta</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Monto</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Referencia</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Glosa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCuentasCorrientes
                        .sort(
                          (a, b) =>
                            selectedMontos.includes(b.valor_moneda_nacional) -
                            selectedMontos.includes(a.valor_moneda_nacional)
                        )
                        .map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-center text-sm sm:pl-0">
                              <input
                                id={`checkbox-${index}`}
                                name={`checkbox-${index}`}
                                type="checkbox"
                                checked={selectedReferenceCuentasCorrientes.includes(item.referencia_his)}
                                onChange={() =>
                                  handleCheckboxChangeCuentasCorrientes(item.referencia_his, item.valor_moneda_nacional)
                                }
                                className={`h-4 w-4 ml-4 rounded border-gray-300 text-customGreen focus:ring-customGreen cursor-pointer ${
                                  selectedMontos.length === 0
                                    ? "text-gray-400 cursor-not-allowed opacity-40"
                                    : "text-customGreen"
                                }`}
                                disabled={selectedMontos.length === 0}
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-[#939393]">
                              {item.codigo_plan_de_cuentas}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 py-4 text-sm font-bold ${
                                item.sentido_cta_vs_valor === 1 ? "text-customGreen" : "text-red-500"
                              }`}
                            >
                              {item.sentido_cta_vs_valor === 1 && (
                                <ArrowTrendingUpIcon className="w-4 h-4 text-customGreen inline-block ml-1" />
                              )}
                              {item.sentido_cta_vs_valor === 2 && (
                                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 inline-block ml-1" />
                              )}
                              {" $"} {formatCurrencyMonto(item.valor_moneda_nacional)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-[#939393]">
                              {formatDate(item.fecha_comprobante_his)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-[#939393]">
                              {item.referencia_his}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-[#939393]">
                              {item.glosa_detalle_compte_his}
                              {selectedMontos.includes(item.valor_moneda_nacional) && (
                                <span className="inline-flex items-center rounded-md bg-customBackgroundGreen px-2 py-1 text-xs font-medium text-customGreen ring-1 ring-inset ring-green-600/20 ml-8">
                                  Coincidencia
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      {filteredCuentasCorrientes.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-4 text-center text-gray-500 bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                          >
                            No se encontraron resultados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-customBackgroundGray p-4 shadow-md flex justify-end">
                  <span className="font-bold mr-4">Diferencia:</span> $ {resultadoFormateado}
                </div>
              </div>
            )}

            {selectedReferenceCuentasCorrientes.length > 0 && (
              <div className="flex justify-end">
                <button onClick={openModal} className="rounded-md bg-customGreen px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-customLightGreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customGreen mt-4 mr-4">
                 {resultado === 0 && selectedReferenceCuentasCorrientes.length > 0 ? 'Match' : 'Match Parcial'}
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
      <CustomModal 
       isOpen={isModalOpen} 
       onClose={closeModal} 
       title={
          modalIsMobile
            ? resultado === 0 
              ? "Match Completo" 
              : "Match Parcial"
            : resultado === 0
              ? "Detalle del Match Completo"
              : "Detalle del Match Parcial"
        }      
       content=
      <div>
            {selectedItem && (
              <div className="flex flex-col p-4 border rounded-md shadow-sm bg-customHeaderGray">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">                    
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-customGreen">
                      <span className="font-medium leading-none text-white">{selectedItem.nombre_titular.substring(0, 2)}</span>
                    </span>
                    <div className="flex flex-col">
                    <div className="text-md font-bold text-[#525252] overflow-hidden text-ellipsis whitespace-nowrap">
                    {modalIsMobile 
                      ? selectedItem.nombre_titular.split(' ').slice(0, 2).join(' ') 
                      : selectedItem.nombre_titular
                    }
                    </div>
                      <div className="text-sm text-gray-500 text-left text-[#939393]">{selectedItem.rut_titular}</div>
                    </div>
                  </div>                  
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <div className="flex flex-col items-start">
                    <div className={selectedItem.monto >= 0 ? "text-customGreen font-bold text-md" : "text-red-500 font-bold text-md"}>
                      $ {formatCurrencyMonto(selectedItem.monto)}
                    </div>
                    <div className="flex items-center mt-1">
                      {selectedItem.monto >= 0 ? (
                        <>
                          <ArrowTrendingUpIcon className="w-3 h-3 text-customGreen" />
                          <p className="text-xs text-customGreen ml-1">Abono</p>
                        </>
                      ) : (
                        <>
                          <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500 ml-1">Cargo</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`${modalIsMobile ? 'text-xs' : 'text-sm'} font-bold text-[#525252]`}>Fecha de emisión</div>
                    <div className="text-sm text-gray-500 text-[#939393]">{formatDate(selectedItem.fecha)}</div>
                  </div>  
                  {!modalIsMobile && (
                      <>                         
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#525252]">Referencia</div>
                          <div className="text-sm text-gray-500 text-[#939393]">{selectedItem.referencia}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#525252]">Tipo</div>
                          <div className="text-sm text-gray-500 text-[#939393]">Recibo</div>
                        </div>
                      </>
                   )}
                </div>
              </div>
            )}
            {filteredMatchedCuentasCorrientes.map((item, index) => (
              <div key={index} className={`flex flex-col ${modalIsMobile ? 'p-2' : 'p-4'} border rounded-md shadow-sm`}>
                <div className="flex justify-between gap-4 items-center">
                  <div className="flex flex-col items-start">
                    <div className={item.sentido_cta_vs_valor === 1 ? "text-customGreen font-bold text-md" : "text-red-500 font-bold text-md"}>
                      <p>$ {formatCurrencyMonto(item.valor_moneda_nacional)}</p>
                    </div>
                    <div className="flex items-center mt-1">
                      {item.sentido_cta_vs_valor === 1 ? (
                        <>
                          <ArrowTrendingUpIcon className="w-3 h-3 text-customGreen" />
                          <p className="text-xs text-customGreen ml-1">Abono</p>
                        </>
                      ) : item.sentido_cta_vs_valor === 2 ? (
                        <>
                          <ArrowTrendingDownIcon className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500 ml-1">Cargo</p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className={`${modalIsMobile ? 'text-xs' : 'text-sm'} font-bold text-[#525252]`}>Fecha de comprobante</div>
                    <div className="text-sm text-gray-500 text-[#939393]">{formatDate(item.fecha_comprobante_his)}</div>
                  </div>
                  {!modalIsMobile && (
                      <>
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#525252]">Referencia</div>
                          <div className="text-sm text-gray-500 text-[#939393]">{item.referencia_his}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#525252]">Tipo</div>
                          <div className="text-sm text-gray-500 text-[#939393]">Recibo</div>
                        </div>
                      </>
                   )}
                </div>
              </div>
            ))}
            </div>
            showCancelButton={true}
            showConfirmButton={true}
            cancelButtonText="Cancelar"
            confirmButtonText="Confirmar"
            onCancel={closeModal}
            onConfirm={() => alert('click')}   
            size="3xl"   
      />
      <BreadCrumbs pages={pages} />
      <SelectWithSearch dataListar={dataListar} accountNumber={accountNumber} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="card bg-white p-4 rounded shadow">
          <div className={`${modalIsMobile ? 'text-sm' : 'text-md'} font-semibold`}>{getCurrentMonthYear()}</div>
          <div className="text-sm text-gray-500">Periodo</div>
        </div>
        <div className="card bg-white p-4 rounded shadow">
          <div className={`${modalIsMobile ? 'text-sm' : 'text-md'} font-semibold`}>{formatCurrency(totalCargos)}</div>
          <div className="text-sm text-gray-500">Cargos</div>
        </div>
        <div className="card bg-white p-4 rounded shadow">
          <div className={`${modalIsMobile ? 'text-sm' : 'text-md'} font-semibold`}>{formatCurrency(totalAbonos)}</div>
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