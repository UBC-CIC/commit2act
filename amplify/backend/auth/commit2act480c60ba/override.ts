import { AmplifyAuthCognitoStackTemplate, AmplifyProjectInfo } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate, amplifyProjectInfo: AmplifyProjectInfo) {
    resources.addCfnResource({
        type:"AWS::Cognito::UserPoolIdentityProvider",
        properties: {
            AttributeMapping: {
                preferred_username: "email",
                name: "name",
            },
            ProviderDetails:{
                client_id: "497146325730-sjbdj86ov2mch3l0rdtuce333cal9n3n.apps.googleusercontent.com",
                client_secret: "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",
                authorize_scopes: "openid email profile",
            },
            ProviderName: "Google",
            ProviderType: "Google",
            UserPoolId: {
                Ref: "UserPool"
            }
        }},
        "google-social-provider"
    )
}
