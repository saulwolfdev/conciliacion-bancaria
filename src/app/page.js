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
// Amplify.configure(config);

export default function Home() {

  const router = useRouter();
  const [user, setUser] = useState({ username: '', password: '' });

  useEffect(() => {
    console.log('aqui')
    getParameters();
  }, []);

  const getParameters = async () => {
    try {
      const p = await getParams();
      console.log('params', p)
      const config = {
        "aws_project_region": "us-east-1",
        "aws_cognito_identity_pool_id": p.data.identity_pool_id,
        "aws_cognito_region": "us-east-1",
        "aws_user_pools_id": p.data.user_pools_id,
        "aws_user_pools_web_client_id": p.data.web_client_id,
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
      console.log(config)
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
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-20">
          <img
            className="mx-auto h-20 w-auto"
            src="/images/inetlogo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Ingresa a tu cuenta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <div>
                <div className="mt-2">
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
                  labelName="Password"
                  type="password"
                  value={user.password}
                  handleInputChange={(e) => handleInputChange(e, "password")}
                  className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />  
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm leading-6">
                  <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
                    ¿No tienes una cuenta? Registrar
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="buttom"
                  className="mt-20 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => logIn()}
                >
                  Iniciar sesión
                </button>
                <button
                  type="buttom"
                  className="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => logOut()}
                >
                  Salir
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
