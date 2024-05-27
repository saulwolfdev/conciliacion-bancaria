import axios from 'axios';


const paramsApi = axios.create({
    baseURL: 'http://localhost:8000/users/',
    
})

export const getParams = () => paramsApi.get('/get_params_cognito/');

