import { getParams } from "@/api/params.api";
import { datos_prueba } from "@/app/layout";

export const getAmplifyConfig = async () => {
    let config;
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
    return(config);
  };