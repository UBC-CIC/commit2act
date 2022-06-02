import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
    const customId = {
        attributeDataType: 'Number',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'id',
        required: false,
      }

    const customType = {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'type',
        required: false,
    }

    const customFirstLogin = {
        attributeDataType: 'String',
        developerOnlyAttribute: false,
        mutable: true,
        name: 'firstLogin',
        required: false,
    }

      resources.userPool.schema = [
        ...(resources.userPool.schema as any[]), // Carry over existing attributes (example: email)
        customId, customType, customFirstLogin
      ]
}