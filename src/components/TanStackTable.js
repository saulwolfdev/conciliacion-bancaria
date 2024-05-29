import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DebouncedInput from "./DebouncedInput";
import { dataOcD, res} from "@/app/lib/dataoc";
import { format } from 'date-fns';
import { datos_prueba } from "@/app/layout";
import Link from 'next/link';
// import DownloadBtn from "./DownloadBtn";

function currencyFormatter({ currency, value}) {
  return new Intl.NumberFormat('es-CL', {currency: currency, style: 'currency'}).format(value);
}

const TanStackTable = ({dataOc, columns, onAccept, onReject, onView, estadoFiltro, onDetail}) => {
  //enviar data
  const [data] = useState(() => [...dataOcD]);
  const [globalFilter, setGlobalFilter] = useState("");
  let table;
  if(datos_prueba){
    table = useReactTable({
      data: dataOcD,
      columns,
      state: { 
        globalFilter,
      },
      getFilteredRowModel: getFilteredRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

  }else{
    table = useReactTable({
      data: dataOc,
      columns,
      state: { 
        globalFilter,
      },
      getFilteredRowModel: getFilteredRowModel(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

  }
  

  return (
    <div className="mt-5 overflow-x-auto shadow-md sm:rounded-lg ">
      <div className="flex justify-between mb-2">
        <div className="w-full flex items-center gap-1">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Buscar en las columnas..."
          />
        </div>
        {/* <DownloadBtn data={data} fileName={"peoples"} /> */}
      </div>
      <table className="m-t-10 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
              <th className="px-6 py-3"> Acciones </th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table?.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              >
                {row.getVisibleCells().map((cell) => (
                  // <td key={cell.id} className="px-6 py-4">
                  //   {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  // </td>
                  <td key={cell.id} className="px-6 py-4">
                    
                    {cell.column.id === "AdqOdTot" ? (
                      (() => {
                        return currencyFormatter({
                          currency: "CLP",
                          value: cell.getValue()
                        });
                      })()
                    ) : cell.column.id === "AdqOdEst" ? (
                      (() => {
                         const estado = {
                          0: "Pendiente",
                          1: "Aprobada",
                          2: "Emitida",
                          3: "Semicumplida",
                          4: "Cumplida",
                          5: "Nula",
                          6: "Rechazada"
                        }[cell.getValue()];
                         return {estado} ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {estado}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                            Estado desconocido
                          </span>
                        );
                      })()
                    ) : cell.column.id === "AdqOdNum" ? (
                        <Link
                          className="pt-2 text-sm text-blue-500 hover:text-blue-600"
                          href='#'
                          onClick={() => onDetail(row.original)}
                        > {cell.getValue()} <span aria-hidden="true"></span></Link>
                    ) : cell.column.id === "AdqOdFcIn" ? (
                       format(new Date(cell.getValue()), 'dd-MM-yyyy')
                    ): (
                      // Si no es ninguna de las columnas especificadas, renderizar el valor utilizando flexRender
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <button className='rounded bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2'
                    onClick={() => onView(row.original)}>
                      Ver
                  </button>
                  {estadoFiltro === null ? 
                  <button className='rounded bg-indigo-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2'
                    onClick={() => onAccept(row.original)}>
                      Aprobar
                  </button>: ''}
                  {estadoFiltro === null || (estadoFiltro === '0' && row.original.estado === 0) ? 
                  <button className='rounded bg-red-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => onReject(row.original)}>
                      Rechazar
                  </button> : ''}
                </td>
              </tr>
            ))
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12}>No existen registros !</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* pagination */}
      <div className="flex items-center justify-end mb-2 gap-2 mt-2">
        <button
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>

        <span className="flex text-sm text-gray-700">
          <div>Pagina&nbsp;</div> 
          <strong>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-700">
          | Ir a la página:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 bg-transparent"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="text-sm p-1 bg-transparent border border-gray-300 rounded-md appearance-none"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TanStackTable;

