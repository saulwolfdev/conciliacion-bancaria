import React from 'react';

const BankModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
console.log("dataModal:", data)
console.log("dataModalAccounts:", data?.data?.accounts);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 rounded shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Cuenta corriente</h2>
        <p className="mb-4">Carga la/las cuentas corrientes para el banco seleccionado</p>
        <div className="flex items-center mb-4">
          <input type="text" placeholder="Search" className="border rounded p-2 w-full" />          
        </div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Banco</th>
              <th className="border p-2">Número de cuenta</th>
              <th className="border p-2">Moneda</th>
              <th className="border p-2">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {data && data.data && data.data.accounts && data.data.accounts.length > 0 ? (
              data.data.accounts.map((account) => (
                <tr key={account.id}>
                  <td className="border p-2">
                    {/* <img src={`/${data.data.institution.id}-logo.png`} alt={data.data.institution.name} className="inline-block mr-2" /> */}
                    {data.data.institution.name}
                  </td>
                  <td className="border p-2">{account.number}</td>
                  <td className="border p-2">{account.currency}</td>
                  <td className="border p-2">{account.balance.current}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2" colSpan="4">
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <span>Total: {data && data.data && data.data.accounts ? data.data.accounts.length : 0} cuentas</span>
          <div>
            <label className="mr-2">Filas por página:</label>
            <select className="border p-2">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-gray-200 p-2 rounded mr-2" onClick={onClose}>Cambiar banco</button>
          <button className="bg-red-500 text-white p-2 rounded">Cargar</button>
        </div>
      </div>
    </div>
  );
};

export default BankModal;
