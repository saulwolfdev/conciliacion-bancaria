import axios from 'axios';


const paramsApi = axios.create({
    baseURL: 'http://localhost:8000/users/',
    headers: {
        'Tenant': typeof window !== 'undefined' ? window.location.hostname : ''
    }
    
    
})

export const getParams = () => paramsApi.get('/get_params_cognito/');

