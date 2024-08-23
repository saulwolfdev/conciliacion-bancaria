"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { balance, listar } from "@/api/fintoc.mock";
import Tabs from "@/components/Tabs";
import SearchCard from "@/components/SearchCard";

const Cartolas = () => {
  const [dataBalance, setDataBalance] = useState(null);
  const [dataListar, setDataListar] = useState(null);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "movimientos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filteredData, setFilteredData] = useState(dataListar || []);

  const stats =
    dataBalance && dataBalance.saldos
      ? [
          {
            name: "Saldo Inicial",
            value: dataBalance.saldos.saldo_inicial.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
          {
            name: "Saldo Final",
            value: dataBalance.saldos.saldo_final.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
          {
            name: "Cargos",
            value: dataBalance.saldos.cargos.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
            change: " ",
          },
          {
            name: "Abonos",
            value: dataBalance.saldos.abonos.toLocaleString("es-CL", {
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
    const fetchData = async () => {
      try {
        const data = balance;
        setDataBalance(data.data);
        console.log("Datos balance:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = listar;
  //       setDataListar(data.data);
  //       console.log("Datos listar:", data);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_movimientos_listar/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cuenta_bancaria_id: 10,
            fecha_inicio: "",
            fecha_termino: "",
            descripcion: "",
            monto_minimo: "",
            monto_maximo: "",
            estados: [1, 2, 3]
          })
        });

        if (!response.ok) {
          throw new Error('La solicitud falló');
        }

        const data = await response.json();
        setDataListar(data.data);
        console.log("Datos listar:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

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

  const tabs = [
    {
      name: "movimientos",
      label: "Movimientos",
      content: (
        <div>
          <SearchCard
            onSearchChange={handleSearchChange}
            dataListar={dataListar}
          />
          {dataBalance && dataBalance.saldos && (
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
                  {(filteredData.length > 0
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
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
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
              <div className="flex justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                  aria-label="Anterior"
                >
                  Anterior
                </button>
                {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map(
                  (_, index) => (
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
                          )
                        )}
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

  return (
    <div className="container md:w-1/1 md:px-16">
      <Tabs tabs={tabs} defaultTab={activeTab} onTabChange={handleTabChange} />
      <div>{tabs.find((tab) => tab.name === activeTab)?.content}</div>
    </div>
  );
};

export default Cartolas;