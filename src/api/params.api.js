import axios from 'axios';


const paramsApi = axios.create({
    // baseURL: 'http://localhost:8000/users/',
    baseURL: 'https://container-inetevo.r1na2lodul27u.us-east-1.cs.amazonlightsail.com/users/',
    headers: {
        'Tenant': typeof window !== 'undefined' ? window.location.hostname.split(".")[0] : ''
    }
    
    
})

export const getParams = () => paramsApi.get('/get_params_cognito/');

