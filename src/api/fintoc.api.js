import axios from 'axios';
console.log("LLAMADA AL ID 1")
const apiClient = axios.create({
  baseURL: 'https://informat.sa.ngrok.io/tesoreria/api/bancos/api_banco_integracion_data2/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const createIntegration = (dataId) => apiClient.post("/",{"id":dataId});

console.log("LLAMADA AL ID")


//ACA FUNCIONA EL MISMO CODIGO

const apiClientTest = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/posts',
  headers: {
    'Content-Type': 'application/json',
  }
});
export const createIntegrationTest = (id) => apiClientTest.post('/', {"id": id});



