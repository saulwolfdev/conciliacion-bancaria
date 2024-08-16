import React, { useState, useEffect } from "react";
import { XCircleIcon } from '@heroicons/react/24/outline';
import { cuentasContables } from "@/api/fintoc.mock";
import { dashboard } from "@/api/fintoc.mock";
import CustomSearchSelect from "@/components/CustomSearchSelect";
import { postBankData } from "@/api/postBankData"; 

const AccountsModal = ({ isOpen, onClose, data, onLoad, lineOfCredit }) => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountingAccounts, setAccountingAccounts] = useState([]); 
  const [selectedOption, setSelectedOption] = useState({});
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const [selectedAccountNames, setSelectedAccountNames] = useState({});

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
  
        setBankAccountsData((prevData) => 
          prevData.filter((item) => item.id !== data?.data?.accounts.find(acc => acc.id === accountId)?.number)
        );
  
        return prevSelected.filter((id) => id !== accountId);
      } else {
        setSelectedOption((prev) => {
          const selectedValue = prev[accountId];
          if (selectedValue) {
            const account = data?.data?.accounts.find(acc => acc.id === accountId);
  
            setBankAccountsData((prevData) => {
              const updatedData = prevData.filter(
                (item) => item.id !== account?.number
              );
  
              return [
                ...updatedData,
                {
                  id: account?.number,
                  cuenta_contable: selectedValue,
                },
              ];
            });
          }
          return prev;
        });
  
        return [...prevSelected, accountId];
      }
    });
  };
  

  const handleSelectAllChange = () => {
    if (selectAll) {      
      setSelectedAccounts([]);
      setSelectedOption({});
      setBankAccountsData([]);
    } else {      
      const allAccountIds = data?.data?.accounts.map((account) => account.id) || [];
      setSelectedAccounts(allAccountIds);
  
      const updatedOptions = {};
      const updatedBankAccountsData = [];
  
      allAccountIds.forEach((accountId) => {
        const account = data?.data?.accounts.find((acc) => acc.id === accountId);
        updatedOptions[accountId] = selectedOption[accountId] || "";
  
        if (account && selectedOption[accountId]) {
          updatedBankAccountsData.push({
            id: account.number,
            cuenta_contable: selectedOption[accountId],
          });
        }
      });
  
      setSelectedOption(updatedOptions);
      setBankAccountsData(updatedBankAccountsData);
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
    postBankData(bankAccountsData);
    onClose();
  };

  const handleSelectChange = (accountId, selectedValue) => {    
    const account = data?.data?.accounts.find(acc => acc.id === accountId);
  
    if (account) {
      console.log("Número de cuenta corriente:", account.number);
    }
  
    setSelectedOption((prev) => {
      const newSelectedOption = { ...prev, [accountId]: selectedValue };
  
      console.log("Número de cuenta contable:", selectedValue);
  
      setSelectedAccounts((prevSelected) => {
        if (!prevSelected.includes(accountId)) {
          return [...prevSelected, accountId];
        }
        return prevSelected;
      });
  
      setBankAccountsData((prevData) => {
        const updatedData = prevData.filter(
          (item) => item.id !== account?.number
        );

        const selectedLineOfCredit = selectedAccountNames[accountId]; 
        const lineOfCreditNumber = selectedLineOfCredit ? selectedLineOfCredit.split(' - ')[1] : ''; 

        const existingAccountIndex = prevData.findIndex(item => item.id === account?.number);
        const updatedAccount = existingAccountIndex !== -1 ? prevData[existingAccountIndex] : {
          id: account?.number,
          cuenta_contable: selectedValue,
          linea_credito: lineOfCreditNumber
        };

        updatedAccount.cuenta_contable = selectedValue;
        updatedAccount.linea_credito = lineOfCreditNumber; 

        if (existingAccountIndex !== -1) {
          const updatedPrevData = [...prevData];
          updatedPrevData[existingAccountIndex] = updatedAccount;
          return updatedPrevData;
        } else {
          return [...prevData, updatedAccount];
        }
      });
  
      console.log("Updated selectedOption:", newSelectedOption);
      return newSelectedOption;
    });
  };
  
  console.log("bankAccountsData para enviar:", bankAccountsData)

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: currency,
    }).format(value);
  };
 
  console.log("datos de data:", data?.data?.accounts)    
  console.log("lineOfCredit:", lineOfCredit)

  const handleAccountSelectChange = (event, accountId) => { 
    setSelectedAccountNames((prev) => ({
      ...prev, 
      [accountId]: event.target.value
    }));

    setBankAccountsData((prevData) => {
      const updatedData = prevData.filter(
        (item) => item.id !== data?.data?.accounts.find(acc => acc.id === accountId)?.number
      );

      const selectedLineOfCredit = event.target.value;
      const lineOfCreditNumber = selectedLineOfCredit ? selectedLineOfCredit.split(' - ')[1] : '';

      return [
        ...updatedData,
        {
          id: data?.data?.accounts.find(acc => acc.id === accountId)?.number,
          cuenta_contable: selectedOption[accountId] || '',
          linea_credito: lineOfCreditNumber 
        },
      ];
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg relative p-4 w-11/12 md:w-4/5 lg:w-2/3 xl:w-1/1">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        onClick={onClose}
      >
      <XCircleIcon className="h-8 w-8" /> 
      </button>
        <h2 className="text-lg font-semibold mb-3">Cuenta corriente</h2>
        <p className="mb-3 text-sm text-gray-700">
          Carga la/las cuentas corrientes para el banco seleccionado
        </p>

        <div className="flex items-center mb-3">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-md p-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                Banco
              </th>
              <th className="px-6 py-3">Número de cuenta</th>
              <th className="px-6 py-3">Moneda</th>
              <th className="px-6 py-3">Saldo Actual</th>
              <th className="px-6 py-3">Saldo disponible</th>
              <th className="px-6 py-3">Cuentas Contables</th>
              <th className="px-6 py-3">Linea de Credito</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts && currentAccounts.length > 0 ? (
              currentAccounts.map((account) => {
                const options = accountingAccounts.map((cuenta) => ({
                  value: cuenta.numero_cuenta,
                  label: `${cuenta.numero_cuenta} - ${cuenta.nombre_cuenta}`,
                  disabled: Object.values(selectedOption).includes(cuenta.numero_cuenta),
                }));

                return (
                  <tr
                    key={account.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => handleCheckboxChange(account.id)}
                      />
                      {data.data.institution.name}
                    </td>
                    <td className="px-6 py-4">{account.number}</td>
                    <td className="px-6 py-4">{account.currency}</td>
                    <td className="px-6 py-4">
                      {formatCurrency(account.balance.current, account.currency)}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(account.balance.available, account.currency)}
                    </td>
                    <td className="px-6 py-4">
                      <CustomSearchSelect
                        options={options}
                        value={selectedOption[account.id]}
                        onChange={(selectedValue) => handleSelectChange(account.id, selectedValue)}
                      />
                    </td>
                    <td className="px-6 py-4">
                    <select
                        value={selectedAccountNames[account.id] || ''} 
                        onChange={(event) => handleAccountSelectChange(event, account.id)}
                        className="ml-2 border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccione una cuenta</option>
                        {lineOfCredit?.map((item) => (
                          <option 
                            key={item.id} 
                            value={`${item.name} - ${item.number}`}
                            disabled={Object.values(selectedAccountNames).includes(`${item.name} - ${item.number}`)} 
                            className={Object.values(selectedAccountNames).includes(`${item.name} - ${item.number}`) ? 'text-gray-500' : ''} 
                          >
                            {item.name} - {item.number}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center h-32">
                <td colSpan="6" className="border p-2 text-center text-sm text-gray-600">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end items-center mt-4">
          <div className="text-sm mr-4">
            <span>Filas por página: </span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="p-1 text-sm focus:ring-0 focus:border-transparent border-0"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="flex items-center text-sm">
            <span className="mr-2">
              {1}-{rowsPerPage} de {totalPages}
            </span>
            <button
              className="p-1.5 rounded text-sm mr-2 hover:bg-gray-200 focus:outline-none"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </button>
            <button
              className="p-1.5 rounded text-sm hover:bg-gray-200 focus:outline-none"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="border border-red-500 text-red-500 p-1.5 rounded mr-2 text-sm"
            onClick={onClose}
          >
            Cambiar banco
          </button>
          <button className="bg-red-500 text-white p-1.5 rounded text-sm" onClick={handleLoadClick}>
            Cargar
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default AccountsModal;