#!/usr/bin/env bash

##
#
#   Args:
#   $1: The Amplify bucket for the project
#   $2: The ARN of the image validation Lambda function
#   $3: The Origin Access Identity for CloudFront
#   
#   This script sets up the trigger in the Amplify S3 bucket so that upon
#   image upload to the bucket it will automatically invoke the validation
#   Lambda function, which will validate the image to ensure it has no
#   explicit content and its labels match what is expected. It then adds a
#   bucket policy to the bucket to allow for CloudFormation to access it
#   
##

JSON=$(cat <<-EOF
    {
        "LambdaFunctionConfigurations": [
            {
                "Id": "LambdaTrigger",
                "LambdaFunctionArn": "$2",
                "Events": [
                    "s3:ObjectCreated:*"
                ],
                "Filter": {
                    "Key": {
                        "FilterRules": [
                            {
                                "Name": "prefix",
                                "Value": "public/validation/input/"
                            }
                        ]
                    }
                }
            }
        ]
    }
EOF
)

echo "Running Script with S3 Bucket $1, Lambda ARN $2, and CloudFront OAI $3";

aws s3api \
  put-bucket-notification-configuration \
  --bucket="$1" \
  --notification-configuration "$JSON";

echo "Added Lambda trigger!"

JSONCF=$(cat <<-EOF
{
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity $3"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$1/*"
        }
    ]
}
EOF
)

aws s3api put-bucket-policy --bucket $1 --policy "$JSONCF"

echo "Finished!"