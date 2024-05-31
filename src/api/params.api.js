import axios from 'axios';


const paramsApi = axios.create({
    baseURL: 'http://localhost:8000/users/',
    headers: {
        'Tenant': window.location.hostname
    }
    
    
})

export const getParams = () => paramsApi.get('/get_params_cognito/');

