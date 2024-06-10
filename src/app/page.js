"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';
import { Amplify } from "aws-amplify";
import { getAmplifyConfig } from '@/utils/amplify_config';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

import Input from '../common/Input';
import { removeAllCookies } from './layout';

const useAuth = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event, keyName) => {
    event.persist();
    setUser((user) => ({ ...user, [keyName]: event.target.value }));
  };

  const clearErrors = () => setErrors({});

  return { user, setUser, errors, setErrors, handleInputChange, clearErrors };
};

const InputField = ({ label, type, value, handleChange, error }) => (
  <div className="mt-2">
    <label className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="relative mt-2 rounded-md shadow-sm">
      <Input
        labelName=""
        type={type}
        value={value}
        handleInputChange={handleChange}
        className={`account-input rounded-md bg-white focus:outline-none focus:shadow-outline border border-gray-300 py-2 px-2 block w-full appearance-none leading-normal ${error ? 'text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500' : ''}`}
      />
      {error && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
      )}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const LoginForm = ({ user, errors, handleInputChange, logIn }) => (
  <div className="w-full md:w-8/12 mt-10 sm:mt-0">
    <InputField
      label="Usuario"
      type="text"
      value={user.username}
      handleChange={(e) => handleInputChange(e, 'username')}
      error={errors.username}
    />
    <InputField
      label="Contraseña"
      type="password"
      value={user.password}
      handleChange={(e) => handleInputChange(e, 'password')}
      error={errors.password}
    />
    <button
      type="button"
      className="mt-10 flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={logIn}
    >
      Iniciar sesión
    </button>
  </div>
);

const LoadingSpinner = () => (
  <div className="loading active fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-customGreen"></div>
    <img src="/images/image.png" className="absolute rounded-full h-24 w-24 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></img>
  </div>
);



export default function Home() {
  const router = useRouter();
  const { user, errors, handleInputChange, clearErrors, setErrors } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configAmplify = async () => {
      try {
        const config = await getAmplifyConfig();
        Amplify.configure(config);
      } catch (error) {
        console.error('Error configuring Amplify', error);
      }
    };
    configAmplify();
  }, []);

  const logIn = async () => {
    setLoading(true);
    try {
      await signOut();
      removeAllCookies();
      await signIn({ username: user.username, password: user.password });
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      Cookies.set('authToken', authToken);    
      Cookies.set('username', user.username);
      Cookies.set('avatar', user.username.substring(0, 2).toUpperCase());
      router.push('/dashboard');
    } catch (error) {
      clearErrors();
      let errorMessage = error?.message || 'An unexpected error occurred';
      const errorMapping = {
        'UserNotFoundException': { username: 'Usuario no existe' },
        'NotAuthorizedException': { password: 'Contraseña incorrecta' },
        'EmptySignInUsername': { username: 'Usuario requerido' },
        'EmptySignInPassword': { password: 'Contraseña requerida' },
      };
      setErrors(errorMapping[error.name] || { general: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      {loading && <LoadingSpinner />}
      <div className={`min-h-screen flex flex-col sm:flex-row ${loading ? 'opacity-50' : ''}`}>
        <div className="w-full sm:w-5/12 bg-white flex flex-col justify-center items-center relative p-4">
          <div className="flex flex-col items-center">
            <img
              className="mb-6"
              src="/images/informat.png"
              alt="Informat Logo"
              style={{ maxWidth: '100%', height: 'auto' }} 
            />
            <h2 className="mt-2 font-heading text-4xl text-gray-900 font-semibold mb-4 text-center">
              Bienvenido
            </h2>
            <h2 className="text-1xl leading-9 tracking-tight text-gray-400 mb-6 text-center">
              Tu gestión empresarial empieza aquí.
            </h2>
          </div>
          <LoginForm
            user={user}
            errors={errors}
            handleInputChange={handleInputChange}
            logIn={logIn}
          />
        </div>
        <div className="hidden sm:flex sm:w-7/12 bg-customGreen items-start justify-center relative" style={{ backgroundImage: 'url(/images/login1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div
            className="rounded-lg shadow-lg p-4 flex items-center justify-start relative"
            style={{
              backgroundColor: 'rgba(55, 54, 54, 0.7)',
              height: 'auto',
              width: '70%',
              maxWidth: '90%',
              margin: '5% auto' // Ajuste el margen para que esté más cerca de la parte superior
            }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
            >
              <SwiperSlide>
                <div className="text-white flex flex-col items-center justify-center h-full">
                  <p className="max-w-2xl text-lg text-white mb-15 font-light">
                    "Nuestro compromiso es con la adaptabilidad, la orientación experta y la satisfacción del cliente."
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="text-white flex flex-col items-center justify-center h-full">
                  <p className="max-w-2xl text-lg text-white mb-15 font-light">
                    "Con más de 45 años de experiencia en el mercado, ofrecemos soluciones ERP personalizadas para empresas de todos los tamaños."
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="text-white flex flex-col items-center justify-center h-full">
                  <p className="max-w-2xl text-lg text-white mb-15 font-light">
                    "Nos especializamos en la consultoría, personalización y soporte continuo para garantizar una integración y operación sin problemas de nuestros sistemas."
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}