import { getAmplifyConfig } from '@/utils/amplify_config';
import { checkToken, getToken } from '@/utils/auth';
import { Amplify } from 'aws-amplify';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('authToken');
const productsApi = axios.create({
    baseURL: 'http://localhost:8000/oc/',
    headers: {
        'Authorization': 'Bearer '+token,
        'Tenant': typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    }
})

export const getAllProduct = (estado) => productsApi.get('/', {'params': {'estado': estado}});
export const getProduct = ({sucursal, numero, anio, mes}) => productsApi.get('/oc_retrieve/', {'params': {'sucursal': sucursal, 'numero': numero, 'anio': anio, 'mes': mes}});
export const createProduct = (data) => productsApi.post('/', data);
export const aprobarRechazarOC = ({id, comentario}) => productsApi.post('/aprobar_rechazar/', {'numero': id.numero, 'anio': id.anio, 'mes': id.mes, 'estado': id.estado, 'comentario': comentario});
export const guardarComentario = ({id, comentario}) => productsApi.post('/guardar_comentario/', {'numero': id.numero, 'anio': id.anio, 'mes': id.mes, 'comentario': comentario});
export const decodificarArchivoApi = ({numero, anio, mes, secuencia}) => productsApi.post('/decodificar_archivo/', {'numero': numero, 'anio': anio, 'mes': mes, 'secuencia': secuencia});
export const getTotales = () => productsApi.get('/get_totales/');

