"use client";
import { Inter } from "next/font/google";
import "./ui/globals.css";
import { setupTokenRefresh } from '../utils/auth';
import { useEffect, useState } from 'react';
import { getParams } from "@/api/params.api";
import { Amplify } from "aws-amplify";


const inter = Inter({ subsets: ["latin"] });
export const datos_prueba = true;

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

export default function RootLayout({ children }) {
  useEffect(() => {
    setupTokenRefresh();
    getParameters();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

