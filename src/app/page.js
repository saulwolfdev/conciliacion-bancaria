"use client";
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { signIn, signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Input from '../common/Input';
import Cookies from 'js-cookie';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { removeAllCookies } from './layout';

import { Amplify } from "aws-amplify";
import { getAmplifyConfig } from '@/utils/amplify_config';

// Amplify.configure(getAmplifyConfig());

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ username: '', password: '' });

  useEffect(() => {
    const configAmplify = async () => {
        const config = await getAmplifyConfig();
        Amplify.configure(config);
    };
    configAmplify();
  }, []);
  

  const handleInputChange = (event, keyName) => {
    event.persist();
    setUser((user) => {
      return { ...user, [keyName]: event.target.value };
    });
  };

  const logIn = async () => {
    try {
      await signOut();
      removeAllCookies();
      await signIn({ username: user.username, password: user.password });
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      Cookies.set('authToken', authToken);    
      Cookies.set('username', user.username);
      Cookies.set('avatar', user.username.substring(0, 2));
      
      router.push('/dashboard');
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  const logOut = async () => {
    try {
      await signOut();
      console.log("Sign out successful");
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="min-h-screen flex flex-col sm:flex-row">
        <div className="w-full sm:w-5/12 bg-white flex flex-col justify-center items-center relative p-4">
          <div className="flex flex-col items-center">
            <img
              className="mb-6"
              src="/images/informat.png"
              alt="Informat Logo"
              style={{ maxWidth: '100%', height: 'auto' }} // Mantener tamaño original
            />
            <h2 className="font-heading text-4xl text-gray-900 font-semibold mb-4 text-center">
              Bienvenido
            </h2>
            <h2 className="text-1xl leading-9 tracking-tight text-gray-400 mb-6 text-center">
              Tu gestión empresarial empieza aquí.
            </h2>
          </div>
          <div className="w-full md:w-8/12 mt-10 sm:mt-0">
            <div className="mt-10">
              <Input
                labelName="Usuario"
                value={user.username}
                handleInputChange={(e) => handleInputChange(e, "username")}
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
              />
            </div>
            <div className="mt-2">
              <Input
                labelName="Contraseña"
                type="password"
                value={user.password}
                handleInputChange={(e) => handleInputChange(e, "password")}
                className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
              />
            </div>
            <button
              type="button"
              className="mt-10 flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => logIn()}
            >
              Iniciar sesión
            </button>
            {/* <button
              type="button"
              className="mt-5 flex w-full justify-center rounded-md bg-customBlue px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => logOut()}
            >
              Salir
            </button> */}
          </div>
        </div>
        <div className="hidden sm:flex sm:w-7/12 bg-customGreen items-center justify-center relative" style={{ backgroundImage: 'url(/images/pc2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div
            className="rounded-lg shadow-lg p-4 flex items-center justify-center relative"
            style={{
              backgroundColor: 'rgba(55, 54, 54, 0.7)',
              height: 'auto',
              width: '70%',
              maxWidth: '90%',
              margin: '20% auto' // Center vertically and adjust margin as needed
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
