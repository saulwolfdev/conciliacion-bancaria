import { getParams } from "@/api/params.api";
import { datos_prueba } from "@/app/layout";
import { products } from "@/app/lib/datainet";

export const getAmplifyConfig = async () => {
    let config;
    if(datos_prueba){

      localStorage.setItem('apps_config', JSON.stringify(products))

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
      let identity_pool_id = localStorage.getItem('identity_pool_id');
      let params;
      if(identity_pool_id){
        params = {
          'identity_pool_id': identity_pool_id,
          'user_pools_id': localStorage.getItem('user_pools_id'),
          'web_client_id': localStorage.getItem('web_client_id'),
        }
      }else{
        const p = await getParams(); 
        params = p.data

        localStorage.setItem('identity_pool_id', p.data.identity_pool_id);
        localStorage.setItem('user_pools_id', p.data.user_pools_id);
        localStorage.setItem('web_client_id', p.data.web_client_id);
        localStorage.setItem('apps_config', JSON.stringify(p.data.apps))
      }
      config = {
        "aws_project_region": "us-east-1",
        "aws_cognito_identity_pool_id": params.identity_pool_id,
        "aws_cognito_region": "us-east-1",
        "aws_user_pools_id": params.user_pools_id,
        "aws_user_pools_web_client_id": params.web_client_id,
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