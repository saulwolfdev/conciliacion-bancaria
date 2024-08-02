import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_integracion_data2/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const createIntegration = (dataId) => apiClient.post("/",{"id":dataId});