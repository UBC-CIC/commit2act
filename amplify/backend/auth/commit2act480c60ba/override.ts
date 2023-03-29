import {
  AmplifyAuthCognitoStackTemplate,
  AmplifyProjectInfo,
} from '@aws-amplify/cli-extensibility-helper';

export function override(
  resources: AmplifyAuthCognitoStackTemplate,
  amplifyProjectInfo: AmplifyProjectInfo
) {
  resources.addCfnResource(
    {
      type: 'AWS::Cognito::UserPoolIdentityProvider',
      properties: {
        AttributeMapping: {
          preferred_username: 'email',
          name: 'name',
          email: 'email',
        },
        ProviderDetails: {
          client_id:
            '497146325730-sjbdj86ov2mch3l0rdtuce333cal9n3n.apps.googleusercontent.com',
          client_secret: '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',
          authorize_scopes: 'openid email profile',
        },
        ProviderName: 'Google',
        ProviderType: 'Google',
        UserPoolId: {
          Ref: 'UserPool',
        },
      },
    },
    'google-social-provider'
  );
  resources.addCfnResource(
    {
      type: 'AWS::Cognito::UserPoolIdentityProvider',
      properties: {
        AttributeMapping: {
          preferred_username: 'email',
          name: 'name',
          email: 'email',
        },
        ProviderDetails: {
          client_id: '3404099616475325',
          client_secret: '90deee13c20db733432407aae083123b',
          authorize_scopes: 'openid email public_profile',
        },
        ProviderName: 'Facebook',
        ProviderType: 'Facebook',
        UserPoolId: {
          Ref: 'UserPool',
        },
      },
    },
    'facebook-social-provider'
  );
}
