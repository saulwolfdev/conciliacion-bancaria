import axios from 'axios';


const paramsApi = axios.create({
    // baseURL: 'http://localhost:8000/users/',
    // baseURL: 'https://inetevo-main.azurewebsites.net/users/',
    baseURL: 'https://inetevo-release.azurewebsites.net/users/',
    headers: {
        'Tenant': typeof window !== 'undefined' ? window.location.hostname.split(".")[0] : 'undefined'
    }
    
    
})

export const getParams = () => paramsApi.get('/get_params_cognito/');

