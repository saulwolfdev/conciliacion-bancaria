import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://informat.sa.ngrok.io/tesoreria/api/bancos/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const createIntegration = (id) => apiClient.post('api_banco_integracion_data2/', {"id": id});