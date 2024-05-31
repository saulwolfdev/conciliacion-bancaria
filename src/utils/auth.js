import Cookies from 'js-cookie';
import { fetchAuthSession } from 'aws-amplify/auth';

export const checkToken = async () => {
    try {
        const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
        Cookies.set('authToken', authToken);
    } catch (error) {
        console.error('Error al renovar tokens:', error);
    }
};

export const setupTokenRefresh = () => {
    setInterval(checkToken, 5 * 60 * 1000); // Verificar cada 5 minutos
};
