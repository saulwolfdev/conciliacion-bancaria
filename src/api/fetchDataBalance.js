export const fetchDataBalance = async (startDate, endDate) => {
    try {
      const body = {
        cuenta_bancaria_id: 10,
        fecha_inicio: startDate ? startDate.toISOString().split('T')[0] : "",
        fecha_termino: endDate ? endDate.toISOString().split('T')[0] : "",
        descripcion: "",
        monto_minimo: "",
        monto_maximo: "",
        estados: [1, 2, 3],
      };
  
      const response = await fetch('https://4591-191-113-111-228.ngrok-free.app/tesoreria/api/bancos/api_banco_dashboard_balance/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const data = await response.json();
      console.log("Datos fetchDataBalance:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  