"use client";
import { useState, useEffect } from "react";
import { signUp } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import { Amplify } from "aws-amplify";
import Link from 'next/link';
import Input from '../../common/Input';
import { getParams } from '@/api/params.api';
// Amplify.configure(config);

export default function Register() {
  const navigate = useRouter();
  const [user, setUser] = useState({ username: "", password: "", email: "", db_name: "", db_host:"", db_port:"" });

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
      return { ...user, [keyName]: event.target.value };
    });
  };

  const signUpPage = async () => {
    try {
        console.log(user)
        await signUp({
            'username': user.username,
            'password': user.password,
            options: {
              userAttributes: {
                'email': user.email
              }
            }
          });
        navigate.push("/confirm-register");
        console.log("success sign up");
    } catch (error) {
        console.log("error", error);
    }
  };

  return (
    
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen min-h-full">

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-20">
        <img
          className="mx-auto h-20 w-auto"
          src="/images/inetlogo.png"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Registro
        </h2>
      </div>
      
      <div className="flex w-full max-w-screen-md mx-auto">
        <div className="w-full">
          <div className="px-4 pt-6 pb-8">
            <Input
              labelName="Username:"
              value={user.username}
              handleInputChange={(e) => handleInputChange(e, "username")}
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
            />
            <Input
              labelName="Password:"
              type="password"
              value={user.password}
              handleInputChange={(e) => handleInputChange(e, "password")}
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
            />
             <Input
              labelName="Email:"
              value={user.email}
              handleInputChange={(e) => handleInputChange(e, "email")}
              className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
            />
            <button
              type="buttom"
              className="mt-20 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => signUpPage()}
            >
              Enviar
            </button>
            <div className="mt-4 text-center">
              <hr />
              <p className="text-gray-700 py-2 text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
