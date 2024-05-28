"use client";
import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { signIn , signOut} from 'aws-amplify/auth';
import { Amplify } from "aws-amplify";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '../common/Input';
import config from '../amplifyconfiguration.json';
import Cookies from 'js-cookie';
import { getParams } from '@/api/params.api';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Amplify.configure(config);

export default function Home() {

  const router = useRouter();
  const [user, setUser] = useState({ username: '', password: '' });

  useEffect(() => {
    getParameters();
  }, []);

  const getParameters = async () => {
    try {
      const p = await getParams();
      const config = {
        "aws_project_region": "us-east-1",
        "aws_cognito_identity_pool_id": p.data.identity_pool_id,
        "aws_cognito_region": "us-east-1",
        "aws_user_pools_id": p.data.user_pools_id,
        "aws_user_pools_web_client_id": p.data.web_client_id,
        // "aws_cognito_identity_pool_id": 'us-east-1:f1f25452-aa26-4dec-92d6-d28071f7d052',
        // "aws_cognito_region": "us-east-1",
        // "aws_user_pools_id": 'us-east-1_33vySxqM9',
        // "aws_user_pools_web_client_id": '2nklsjq8odvmumr52fo3d81fiv',
        "oauth": {},
        "aws_cognito_username_attributes": [],
        "aws_cognito_social_providers": [],
        "aws_cognito_signup_attributes": [
          "EMAIL"
        ],
        "aws_cognito_mfa_configuration": "OFF",
        "aws_cognito_mfa_types": [
          "SMS"
        ],
        "aws_cognito_password_protection_settings": {
          "passwordPolicyMinLength": 8,
          "passwordPolicyCharacters": []
        },
        "aws_cognito_verification_mechanisms": [
          "EMAIL"
        ]
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
    })
  }


  const logIn = async () => {
    console.log('user', user)
    try {
      await signIn({ username: user.username, password:user.password });
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
      console.log('token', authToken)
      Cookies.set('authToken', authToken);
      // Perform your login logic here
      console.log("Sign in successful");
      router.push('/dashboard');
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  const logOut = async () => {
    try {
      await signOut();
      console.log("Sign out successful");
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <>
    <div className="min-h-screen flex relative">
      <div className="absolute inset-0 flex">
        <div className="w-full sm:w-9/12 bg-white"></div>
        <div className="hidden sm:block sm:w-3/12 bg-customGreen"></div>
      </div>

      {/* Logo en la parte superior izquierda */}
      <div className="absolute" style={{ top: '33px', left: '48px' }}>
        <img
          style={{ width: '143.18px', height: '43px', opacity: 1 }}
          src="/images/informat.png"
          alt="Informat Logo"
        />
      </div>

      {/* Contenedor principal centrado que ocupa 10/12 del ancho total de la pantalla */}
      <div className="relative w-10/12 mx-auto flex flex-col lg:flex-row items-center justify-center z-10">
        {/* Login - ocupando 6/12 del contenedor principal */}
        <div className="w-full lg:w-6/12 flex justify-center items-center">
          <div className="w-full md:w-8/12">
            <h2 className="mt-10 text-left text-4xl leading-9 tracking-tight text-indigo-900">
              Bienvenido
            </h2>
            <h2 className="mt-5 text-left text-1xl leading-9 tracking-tight text-gray-400">
              Tu gestión empresarial empieza aquí
            </h2>
            <div>
              <div className="mt-20">
                <Input
                  labelName="Email"
                  value={user.username}
                  handleInputChange={(e) => handleInputChange(e, "username")}
                  className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />
              </div>
            </div>
            <div>
              <div className="mt-2">
                <Input
                  labelName="Contraseña"
                  type="password"
                  value={user.password}
                  handleInputChange={(e) => handleInputChange(e, "password")}
                  className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-20 flex w-full justify-center rounded-md bg-customBlue px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => logIn()}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className="mt-5 flex w-full justify-center rounded-md bg-customBlue px-3 py-1.5 text-sm leading-6 text-white shadow-sm hover:bg-customBlue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => logOut()}
            >
              Salir
            </button>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-6/12 justify-center items-center">
          <div className="w-full p-8">
            <div
              className="rounded-lg shadow-lg p-4 flex items-center justify-center"
              style={{
                backgroundImage: 'linear-gradient(to top, rgba(255, 255, 255, 0.7), rgba(153, 153, 153, 0))',
                height: '739px', 
                width: '653px',
                backgroundColor: '#e5e6e6', 
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
                    <p
                      className="mt-5 text-customBlue italic"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '36px',
                        lineHeight: '43.57px',
                      }}
                    >
                      Ahorra tiempo y maximiza tu productividad
                    </p>
                    <Image className="mt-10" src="/tuerca.png" alt="Image 1" width={483} height={483} />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="text-white flex flex-col items-center justify-center h-full">
                    <p
                      className="mt-5 text-customBlue italic"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '36px',
                        lineHeight: '43.57px',
                      }}
                    >
                      Ahorra tiempo y maximiza tu productividad
                    </p>
                    <Image className="mt-10" src="/tuerca.png" alt="Image 2" width={483} height={483} />
                    
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
