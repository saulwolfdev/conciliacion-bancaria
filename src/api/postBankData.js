export const postBankData = async (bankAccountsData) => {
    const payload = {
      tipo: 2,
      banco_id: "link_oObKGalip9eXP8y5",
      cuentas_bancarias: bankAccountsData.map(account => ({
        id: account.id,
        cuenta_contable: account.cuenta_contable,
        linea_credito: account.id, 
      })),
    };
  
    console.log("Payload completo:", payload);
  
    try {
      const response = await fetch('https://informat.sa.ngrok.io/tesoreria/api/bancos/api_crear_banco/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };
  