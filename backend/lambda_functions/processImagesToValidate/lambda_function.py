'''
Is invoked automatically when an image is places inside the validation/input/ folder
inside of the amplify bucket associated with the project.
This Lambda will move the image to another bucket in order to perform image validation
with Rekognition, which isnt available in all regions. If the amplify bucket is in
the same region as the Rekognition bucket, there will be no accociated costs with the moving
'''

import boto3
from decimal import Decimal
import json
import urllib.request
import urllib.parse
import urllib.error
import os

ssm = boto3.client('ssm')
s3 = boto3.resource('s3')
validation_bucket = os.environ['validation_bucket'] # # the destination, this bucket should be in a region with Rekognition

def lambda_handler(event, context):
    '''
    Invoked automatically upon iamge being placed in [amplify-bucket]/validation/input/
    '''

    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    try:
        # copies the image over to the validation bucket, in a directory called validation
        s3.meta.client.copy({"Bucket": bucket, "Key": key}, validation_bucket, f'validation/{key.split("/")[-1]}')
        print(f'successfully sent image {key} to the validation bucket')
        
        # deletes the image in amplify bucket
        response = s3.meta.client.delete_object(Bucket=bucket, Key=key)
        print(f'successfully deleted image {key} from the validation bucket {bucket}')
        
    
    except Exception as e:
        print("Error processing object {} from bucket {}. ".format(key, bucket))
        print(e)
        raise e
