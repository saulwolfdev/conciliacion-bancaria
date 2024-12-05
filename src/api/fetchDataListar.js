export const fetchDataListar = async (startDate, endDate) => {
    try {
      const body = {
        cuenta_bancaria_id: 10,
        rut: "",
        fecha_inicio: startDate ? startDate.toISOString().split('T')[0] : "",
        fecha_termino: endDate ? endDate.toISOString().split('T')[0] : "",
        descripcion: "",
        monto_minimo: "",
        monto_maximo: "",
        estados: [1, 2, 3],
      };
  
      const response = await fetch('https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_movimientos_listar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  
      const data = await response.json();
      console.log("Datos fetchDataListar:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };