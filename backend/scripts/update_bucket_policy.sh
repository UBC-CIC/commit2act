#!/usr/bin/env bash

##
#
#   Args:
#   $1: The Amplify bucket for the project
#   $2: The Origin Access Identity for CloudFront
#   
#   Sets the Amplify Bucket policy to allow CloudFront to read from it
#   
##

JSON=$(cat <<-EOF
{
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity $2"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$1/*"
        }
    ]
}
EOF
)

echo "$JSON"

aws s3api put-bucket-policy --bucket $1 --policy "$JSON"

echo "Finished!"