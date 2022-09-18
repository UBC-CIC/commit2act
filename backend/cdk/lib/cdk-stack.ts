import { Stack, StackProps, CfnParameter } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications'
import * as iam from 'aws-cdk-lib/aws-iam';
import { ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { aws_amplify as amplify } from 'aws-cdk-lib';


export class CdkStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const BucketName = ssm.StringParameter.valueForStringParameter(this, 'BucketName');

    const validateImageWithRekognitionLambda = lambda.Function.fromFunctionArn(this, "lambda-from-name", `arn:aws:lambda:${props?.env?.region}:${props?.env?.account}:function:validateImageWithRekognition`);

    const imageBucket = s3.Bucket.fromBucketArn(this, 'bucket-from-arn', `arn:aws:s3:::${BucketName}`)
    //const imageBucket = s3.Bucket.fromBucketName(this, "bucket-from-name", BucketName);
    
    imageBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(validateImageWithRekognitionLambda), {
      prefix: 'public/validation/input/'
    });

    const CloudFrontOriginAccessIdentity = new CfnParameter(this, 'CloudFrontOriginAccessIdentity', {
      type: 'String',
      description: 'The Cloud Front Orgin Access Identity',
    });

    const policyStatement = new iam.PolicyStatement();
    policyStatement.addActions('s3:GetObject');
    policyStatement.addResources(`${imageBucket.bucketArn}/*`);
    policyStatement.addArnPrincipal("arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity "+CloudFrontOriginAccessIdentity.valueAsString);

    const bucketPolicy = new s3.CfnBucketPolicy(this, 'cloudfrontAccessBucketPolicy', {
      bucket: imageBucket.bucketName,
      policyDocument: new iam.PolicyDocument({
        statements: [
          policyStatement
        ]
      })
    });
  }


}
