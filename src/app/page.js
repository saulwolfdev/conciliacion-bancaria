"use client";
import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { signIn, signOut } from 'aws-amplify/auth';
import { Amplify } from "aws-amplify";
import { useRouter } from 'next/navigation';
import Input from '../common/Input';
import Cookies from 'js-cookie';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getParams } from '@/api/params.api';
import { datos_prueba } from './layout';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ username: '', password: '' });
  
  

  useEffect(() => {
    getParameters();
  }, []);

  const getParameters = async () => {
    let config;
    try {
      if(datos_prueba){
         config = {
          "aws_project_region": "us-east-1",
          "aws_cognito_identity_pool_id": 'us-east-1:f1f25452-aa26-4dec-92d6-d28071f7d052',
          "aws_cognito_region": "us-east-1",
          "aws_user_pools_id": 'us-east-1_33vySxqM9',
          "aws_user_pools_web_client_id": '2nklsjq8odvmumr52fo3d81fiv',
          "oauth": {},
          "aws_cognito_username_attributes": [],
          "aws_cognito_social_providers": [],
          "aws_cognito_signup_attributes": ["EMAIL"],
          "aws_cognito_mfa_configuration": "OFF",
          "aws_cognito_mfa_types": ["SMS"],
          "aws_cognito_password_protection_settings": {
            "passwordPolicyMinLength": 8,
            "passwordPolicyCharacters": []
          },
          "aws_cognito_verification_mechanisms": ["EMAIL"]
        }

      }else{
        const p = await getParams();
        config = {
          "aws_project_region": "us-east-1",
          "aws_cognito_identity_pool_id": p.data.identity_pool_id,
          "aws_cognito_region": "us-east-1",
          "aws_user_pools_id": p.data.user_pools_id,
          "aws_user_pools_web_client_id": p.data.web_client_id,
          "oauth": {},
          "aws_cognito_username_attributes": [],
          "aws_cognito_social_providers": [],
          "aws_cognito_signup_attributes": ["EMAIL"],
          "aws_cognito_mfa_configuration": "OFF",
          "aws_cognito_mfa_types": ["SMS"],
          "aws_cognito_password_protection_settings": {
            "passwordPolicyMinLength": 8,
            "passwordPolicyCharacters": []
          },
          "aws_cognito_verification_mechanisms": ["EMAIL"]

        }
      
      }
      Amplify.configure(config);
    } catch (error) {
      console.log('error getting params: ', error);
    }
  };

  const handleInputChange = (event, keyName) => {
    event.persist();
    setUser((user) => {
      return { ...user, [keyName]: event.target.value }
    });
  };

  const logIn = async () => {
    try {
      await signOut();
      await signIn({ username: user.username, password: user.password });
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      Cookies.set('authToken', authToken);
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
      <div className="min-h-screen flex">
        <div className="w-full sm:w-5/12 bg-white flex justify-center items-center">
          <div className="absolute" style={{ top: '33px', left: '48px' }}>
            <img
              style={{ width: '143.18px', height: '43px', opacity: 1 }}
              src="/images/informat.png"
              alt="Informat Logo"
            />
          </div>
          <div className="w-full md:w-8/12">
            <h2 className="mt-10 font-heading text-4xl text-gray-900 font-semibold mb-4">
              Bienvenido
            </h2>
            <h2 className="mt-5 text-left text-1xl leading-9 tracking-tight text-gray-400 text-gray-500 mb-6">
              Tu gestión empresarial empieza aquí !
            </h2>
            <div className="mt-20">
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
              className="mt-20 flex w-full justify-center rounded-md bg-customGreen px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
        <div className="hidden sm:flex sm:w-7/12 bg-customGreen items-center justify-center" style={{ backgroundImage: 'url(/images/pc2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div
            className="rounded-lg shadow-lg p-4 flex items-center justify-center relative"
            style={{
              // backgroundImage: 'linear-gradient(to top, rgba(153, 153, 153, 0.7), rgba(153, 153, 153, 0))',
              backgroundColor: 'rgba(55, 54, 54, 0.7)',
              height: '200px',
              width: '70%',
              maxWidth: '90%',
              // backgroundColor: '#e5e6e6',
              top: '300px' // Adjust this value to move the Swiper down
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
                <p className="max-w-2xl  text-lg text-white mb-15 font-light">
                  "Nuestro compromiso es con la adaptabilidad, la orientación experta y la satisfacción del cliente."
                </p>
              </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="text-white flex flex-col items-center justify-center h-full">
                  <p className="max-w-2xl  text-lg text-white mb-15 font-light">
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
