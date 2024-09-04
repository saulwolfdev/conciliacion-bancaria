"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { balance, listar } from "@/api/fintoc.mock";
import Tabs from "@/components/Tabs";
import SearchCard from "@/components/SearchCard";
import BreadCrumbs from "@/components/BreadCrumbs";
import SelectWithSearch from "@/components/SelectWithSearch";
import { fetchDataBalance } from "@/api/fetchDataBalance";

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
  const itemsPerPage = 20;

  useEffect(() => {
    const numero = localStorage.getItem('accountNumber');
    setAccountNumber(numero);
  }, []);
console.log("accountNumber desde cartolas page:", accountNumber)
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

      console.log("Calculated stats:", stats);

  const handleSearchChange = (data) => {
    setFilteredData(data);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);


   //para usar balance desde mock

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = balance;
  //       setDataBalance(data.data);
  //       console.log("Datos balance:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const body = {
  //             cuenta_bancaria_id: 10,
  //             fecha_inicio: "",
  //             fecha_termino: "",
  //             descripcion: "",
  //             monto_minimo: "",
  //             monto_maximo: "",
  //             estados: [1, 2, 3],
  //       };

  //       const response = await fetch('https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_dashboard_balance/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(body)
  //       });

  //       const data = await response.json(); 
  //       // setDataBalance(data.data);
  //       console.log("Datos balance:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  //para usar dataListar desde mock

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = listar;
  //       setDataListar(data.data);
  //       setDataTotals(data)
  //       console.log("Datos listar:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_movimientos_listar/",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             cuenta_bancaria_id: 10,
  //             fecha_inicio: "",
  //             fecha_termino: "",
  //             descripcion: "",
  //             monto_minimo: "",
  //             monto_maximo: "",
  //             estados: [1, 2, 3],
  //           }),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("La solicitud falló");
  //       }

  //       const data = await response.json();
  //       setDataListar(data.data);
  //       setDataTotals(data)
  //       console.log("Datos listar funcionando:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (dataListar) {
      setFilteredData(dataListar);
    }
  }, [dataListar]);

  const totalPages = dataListar
    ? Math.ceil(dataListar.length / itemsPerPage)
    : 0;

  const currentData = dataListar
    ? dataListar.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

console.log("dataBalance padre del padre",  typeof dataBalance?.data?.saldos?.saldo_inicial )

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
      content: <div>Contenido de Match Financieros</div>,
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
  console.log("dataTotals revision:", dataTotals);
  console.log("totales:", totales);
  console.log("filteredData:", filteredData)
  const totalCargos = totales && totales.length > 0 ? totales[0]["$ - CLP"].total_cargos : "N/A";
  const totalAbonos = totales && totales.length > 0 ? totales[0]["$ - CLP"].total_abonos : "N/A";

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
    </div>
  );
};

export default Cartolas;