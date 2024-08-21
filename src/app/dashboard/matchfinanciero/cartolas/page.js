"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { balance, listar } from "@/api/fintoc.mock";
import Tabs from "@/components/Tabs";

const Cartolas = () => {
  const [dataBalance, setDataBalance] = useState(null);
  const [dataListar, setDataListar] = useState(null);
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "movimientos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = listar;
        setDataListar(data.data);
        console.log("Datos listar:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

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
      id: "movimientos",
      label: "Movimientos",
      content: (
        <div>
          {dataBalance && dataBalance.saldos && (
            <div className="mt-4">
              <div className="flex justify-around">
                <span className="text-gray-500">
                  Saldo Inicial:{" "}
                  <span className="font-bold">
                    {parseInt(dataBalance.saldos.saldo_inicial).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </span>
                </span>
                <span className="text-gray-500">
                  Saldo Final:{" "}
                  <span className="font-bold">
                    {parseInt(dataBalance.saldos.saldo_final).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </span>
                </span>
                <span className="text-gray-500">
                  Cargos:{" "}
                  <span className="font-bold">
                    {parseInt(dataBalance.saldos.cargos).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </span>
                </span>
                <span className="text-gray-500">
                  Abonos:{" "}
                  <span className="font-bold">
                    {parseInt(dataBalance.saldos.abonos).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </span>
                </span>
              </div>
            </div>
          )}
          <div className="mt-6">
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
                {currentData.map((item, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
                        parseInt(item.monto) < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {parseInt(item.monto) < 0 
                        ? `(${Math.abs(parseInt(item.monto)).toLocaleString("es-CL", { style: "currency", currency: "CLP" })})`
                        : Math.abs(parseInt(item.monto)).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`
                          inline-block px-3 py-1 
                          text-xs font-medium 
                          rounded-full 
                          ${item.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}
                      >
                        {item.estado === 'Sin Conciliar' ? 'Sin Match' : item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, dataListar?.length)} de{" "}
              {dataListar?.length} registros
            </span>
            <div className="inline-flex -space-x-px">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Anterior"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, index) => (
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
                disabled={currentPage === totalPages}
                className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Próximo"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "match",
      label: "Match Financieros",
      content: <div>Contenido de Match Financieros</div>,
    },
    {
      id: "anular",
      label: "Anular Movimientos",
      content: <div>Contenido de Anular Movimientos</div>,
    },
  ];

  return <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />;
};

export default Cartolas;