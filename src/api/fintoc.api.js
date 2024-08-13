// export const sendPostRequest = async (dataId) => {
//   try {
//     const response = await fetch('https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_integracion_data2/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id: dataId }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Error: ${response.status}, ${JSON.stringify(errorData)}`);
//     }

//     const data = await response.json();
//     console.log('Complete data:', data);
//     console.log("response.type =", response.type);
//     return data;
//   } catch (error) {
//     if (error.message.includes('Error:')) {
//       console.error('Data error!', error.message);
//     } else {
//       console.error('Error setting:', error.message);
//     }
//   }
// };



//para poder usar el mock

import { mockData } from '@/api/fintoc.mock';

export const sendPostRequest = async () => {
  try {   
    const response = {
      ok: true,
      json: async () => mockData,
    };

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status}, ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Complete data:', data);
    return data;
  } catch (error) {
    if (error.message.includes('Error:')) {
      console.error('Data error!', error.message);
    } else {
      console.error('Error setting:', error.message);
    }
  }
};


// {
//   "tipo": 2,
//   "banco_id": "link_oObKGalip9eXP8y5",
//   "cuentas_bancarias": [
//       {
//           "id": "71479943",
//           "cuenta_contable": "123123",   
                     
//       },     
//   ]
// }