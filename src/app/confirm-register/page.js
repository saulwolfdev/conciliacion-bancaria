"use client";
import { confirmSignUp } from 'aws-amplify/auth';
import React, { useState } from 'react';
import Input from '../../common/Input';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmRegister () {
  let navigate = useRouter();
  const [user, setUser] = useState({ username: '', authenticationCode: '', });

  const handleInputChange = (event, keyName) => {
    event.persist();
    setUser((user) => {
      return { ...user, [keyName]: event.target.value }
    })
  }

const handleSignUpConfirmation = async () => {
    try {
        console.log(user)
        console.log(user.username)
        await confirmSignUp({username: user.username, confirmationCode:user.authenticationCode});
        console.log('success confirm sign up');
        navigate.push('/');
    } catch (error) {
        console.log('error confirming sign up:', error);
    }
}

  return (

    <div className="flex flex-1 flex-col items-center justify-center min-h-screen min-h-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-20">
            <img
            className="mx-auto h-20 w-auto"
            src="/images/inetlogo.png"
            alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Confirmar Registro
            </h2>
        </div>
        <div className="flex w-full max-w-screen-md mx-auto">
            <div className="w-full">
                <div className="px-12 pt-6 pb-8 mb-4 mx-32">
                <Input
                    labelName='Username:'
                    value={user.username}
                    handleInputChange={(e) => handleInputChange(e, 'username')}
                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />
                <Input
                    labelName='Code:'
                    value={user.authenticationCode}
                    handleInputChange={(e) => handleInputChange(e, 'authenticationCode')}
                    className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-sm py-2 px-2 block w-full appearance-none leading-normal"
                />
                <button
                    onClick={() => handleSignUpConfirmation()}
                    className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Confirm
                </button>
                
                <div className='mt-5'>
                    <Link
                        href='/register'
                        className="pt-2 text-sm text-blue-500 hover:text-blue-600"
                    >
                        Volver
                    </Link>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}
