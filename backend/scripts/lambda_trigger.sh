#!/usr/bin/env bash

##
#
#   Args:
#   $1: The Amplify bucket for the project
#   $2: The ARN of the image validation Lambda function
#   
#   This script sets up the trigger in the Amplify S3 bucket so that upon
#   image upload to the bucket it will automatically invoke the validation
#   Lambda function, which will validate the image to ensure it has no
#   explicit content and its labels match what is expected
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

echo "Running Script with S3 Bucket $1 and Lambda ARN $2";

aws s3api \
  put-bucket-notification-configuration \
  --bucket="$1" \
  --notification-configuration "$JSON"