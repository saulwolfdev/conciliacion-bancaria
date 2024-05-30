"use client";
import { useState} from "react";
import { signUp } from "aws-amplify/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../../common/Input';

export default function Register() {
  const navigate = useRouter();
  const [user, setUser] = useState({ username: "", password: "", email: "", db_name: "", db_host:"", db_port:"" });

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
