import React, { useState, useEffect } from "react";
import { cuentasContables } from "@/api/fintoc.mock";
import CustomSearchSelect from "@/components/CustomSearchSelect";

const AccountsModal = ({ isOpen, onClose, data, onLoad }) => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountingAccounts, setAccountingAccounts] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = cuentasContables;
        setAccountingAccounts(data.data);
        console.log("Datos Cuentas Contables:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  if (!isOpen) return null;

  const handleCheckboxChange = (accountId) => {
    setSelectedAccounts((prevSelected) => {
      if (prevSelected.includes(accountId)) {
        setSelectedOption((prev) => {
          const newSelectedOption = { ...prev };
          delete newSelectedOption[accountId];
          return newSelectedOption;
        });
        return prevSelected.filter((id) => id !== accountId);
      } else {
        return [...prevSelected, accountId];
      }
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedAccounts([]);
    } else {
      const allAccountIds =
        data?.data?.accounts.map((account) => account.id) || [];
      setSelectedAccounts(allAccountIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const filteredAccounts = data?.data?.accounts.filter(
    (account) =>
      account.number.includes(searchTerm) ||
      data.data.institution.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastAccount = currentPage * rowsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - rowsPerPage;
  const currentAccounts = filteredAccounts?.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const totalPages = Math.ceil((filteredAccounts?.length || 0) / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLoadClick = () => {
    onLoad(selectedAccounts);
    onClose();
  };

  const handleSelectChange = (accountId, selectedValue) => {
    setSelectedOption((prev) => {
      const newSelectedOption = { ...prev, [accountId]: selectedValue };

      setSelectedAccounts((prevSelected) => {
        if (!prevSelected.includes(accountId)) {
          return [...prevSelected, accountId];
        }
        return prevSelected;
      });

      console.log("Updated selectedOption:", newSelectedOption);
      return newSelectedOption;
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/2 p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Cuenta corriente</h2>
        <p className="mb-4">
          Carga la/las cuentas corrientes para el banco seleccionado
        </p>
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                Banco
              </th>
              <th className="border p-2">Número de cuenta</th>
              <th className="border p-2">Moneda</th>
              <th className="border p-2">Saldo Actual</th>
              <th className="border p-2">Saldo disponible</th>
              <th className="border p-2">Cuentas Contables</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts && currentAccounts.length > 0 ? (
              currentAccounts.map((account) => {
                const options = accountingAccounts.map((cuenta) => ({
                  value: cuenta.numero_cuenta,
                  label: `${cuenta.numero_cuenta} - ${cuenta.nombre_cuenta}`,
                  disabled: Object.values(selectedOption).includes(cuenta.numero_cuenta)
                }));

                return (
                  <tr key={account.id}>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => handleCheckboxChange(account.id)}
                      />
                      {data.data.institution.name}
                    </td>
                    <td className="border p-2">{account.number}</td>
                    <td className="border p-2">{account.currency}</td>
                    <td className="border p-2">{account.balance.current}</td>
                    <td className="border p-2">{account.balance.available}</td>
                    <td className="border p-2">
                      <CustomSearchSelect
                        options={options}
                        value={selectedOption[account.id]}
                        onChange={(selectedValue) => handleSelectChange(account.id, selectedValue)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span>Mostrar </span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border p-2"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            className="bg-gray-200 p-2 rounded mr-2"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="bg-gray-200 p-2 rounded ml-2"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-200 p-2 rounded mr-2" onClick={onClose}>
            Cambiar banco
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={handleLoadClick}
          >
            Cargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountsModal;