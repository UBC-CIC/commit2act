'''
This Lambda function's purpose is to use AWS Rekognition's detect labels feature to determine if a
user's photo for a submitted action is valid. This function compares the labels of the action associated
with the submitted action with the response from Rekognition. If at least 1 of the labels in the image
is on the list of valid labels for the action, and if the label has a high enough confidence, 
the images passes validation, and goes into the bucket of the Amplify project
'''

import boto3
from decimal import Decimal
import json
import urllib.request
import urllib.parse
import urllib.error
import pymysql
import os
# from PIL import Image, ExifTags
import io
import time

print('Loading function')

rekognition = boto3.client('rekognition')
ssm = boto3.client('ssm')
s3 = boto3.resource('s3')

db_host     = os.environ['ENDPOINT']
db_user     = os.environ['USERNAME']
db_password = os.environ['PASSWORD']
db_database = os.environ['DBNAME']

CLOUDFRONT_URL = os.environ['CLOUDFRONT_URL']
AMPLIFY_BUCKET = os.environ['AMPLIFY_BUCKET']

def image_from_s3(bucket, key):
    # Returns an image object for an image file in an s3 bucket (the path in s3 is "bucket/key")
    # used for image analysis without AWS services if it is desired
    # this function is not working at the moment! can be expanded upon
    bucket = s3.Bucket(bucket)
    image = bucket.Object(key)
    img_data = image.get().get('Body').read()

    return Image.open(io.BytesIO(img_data))


def detect_labels(bucket, key):
    """
    inputs:
        bucket: string, the name of the bucket that we are listening to for image uploads
        key: string, the filename of the uploaded image
    output:
        response: dict, contains the result from Rekognition
        
    does the image validation using Rekognition for a user submitting an action
    the threshold is determined by the parameter store parameter MINIMUM_REKOGNITION_CONFIDENCE_THRESHOLD which is located in the same region as this lambda
    
    the objects are uploaded to the validation bucket with a very specific name, for example:
        10-bike-bicycle-shoe-shoes-bus-public_transportation.png
    where the leading number is the id of the submitted action, and the other words are our valid labels (what we are checking the uploaded image for)
    
    if any of the valid_labels are seen in the image with a confidence higher than MINIMUM_REKOGNITION_CONFIDENCE_THRESHOLD, they get sent to a
    different bucket for storage and distribution through cloudf.
    """
    t = time.time()
    print(f'{time.time() - t:.3f} seconds since invocation. Detecting labels for image {key} in bucket {bucket}')
    
    # get the minimum rekognition confidence threshold for detect labels
    response = ssm.get_parameters(
        Names=['MINIMUM_REKOGNITION_CONFIDENCE_THRESHOLD']
    )
    min_confidence = float(response['Parameters'][0]['Value'])
    
    print(f'{time.time() - t:.3f} seconds since invocation. Minimum confidence: {min_confidence}')

    # connect to the database through the RDS proxy
    conn = pymysql.connect(host=db_host, user=db_user, password=db_password, database=db_database, cursorclass=pymysql.cursors.DictCursor) #connect_timeout=5
    cur = conn.cursor()
    
    print(f'{time.time() - t:.3f} seconds since invocation. Successfully established connection to the database')
    
    # get the id of the submitted action
    submitted_action_id = int(key.split("/")[-1].split(".")[0])
    
    # first see if image is explicit
    moderation_labels = rekognition.detect_moderation_labels(Image={'S3Object':{'Bucket':bucket,'Name':key}})
    if len(moderation_labels['ModerationLabels']) > 0:
        print(f'{time.time() - t:.3f} seconds since invocation. Innapropriate content found in image: {moderation_labels["ModerationLabels"]}\nDeleting image')
        # some explicit inappropriate content was found
        response = s3.meta.client.delete_object(Bucket=bucket, Key=key)
        print(f'Successfully deleted image {key} from the validation bucket {bucket}')
        
        sql = f'UPDATE SubmittedAction SET is_graveyarded=1, is_image_explicit=1 where sa_id={submitted_action_id};'
        print('Executing statement', sql)
        cur.execute(sql) 
        conn.commit()  # required for statements that have UPDATE
        cur.close()
        conn.close()
        
        return None
    
    print(f'{time.time() - t:.3f} seconds since invocation. Image had no detected innapropriate content, proceeding to fetch labels from the database.')

    cur.execute(f'select * from ActionValidationLabel where action_id = (select `Action`.action_id from SubmittedAction JOIN `Action` on `Action`.action_id = SubmittedAction.action_id where SubmittedAction.sa_id={int(key.split("/")[-1].split(".")[0])});') #
    res = cur.fetchall()
    valid_labels = [r['validation_label'] for r in res]
    
    print(f'{time.time() - t:.3f} seconds since invocation. Passing image to rekognition to detect labels')
    response = rekognition.detect_labels(Image={"S3Object": {"Bucket": bucket, "Name": key}})
    
    # gets the image EXIF data, this section is unused for now, but can be expanded upon in the future
    # img = image_from_s3(bucket, key)
    # img_exif = img.getexif()
    # if img_exif is None:
    #     print('The image has no EXIF data')
    # else:
    #     print('Image EXIF data:')
    #     for key_, val_ in img_exif.items():
    #         if key_ in ExifTags.TAGS:
    #             print(f'{ExifTags.TAGS[key_]}:{val_}')

    confidence_list = [i['Confidence'] for i in response['Labels'] if i['Name'].lower() in valid_labels]
    pass_or_fail = "pass"  # changes to fail if image fails
    
    if not confidence_list or max(confidence_list) < min_confidence:
        # no label in the image had enough confidence, or no valid label appeared in Rekognition's reponse
        print(f'{time.time() - t:.3f} seconds since invocation. Image failed validation')
        pass_or_fail = "fail"
    else:
        print(f'{time.time() - t:.3f} seconds since invocation. Image passed validation!')
    
    # key for the Amplify bucket, what we will name the image in the amplify bucket
    bucket_key_name = f'validation/{pass_or_fail}/{key.split("/")[-1]}'

    # print(s3.meta.client.list_objects(Bucket=bucket))

    try:
        # Move the image to the Amplify bucket
        print(f'{time.time() - t:.3f} seconds since invocation. Moving photo from bucket {bucket}, key {key} TO {AMPLIFY_BUCKET}, {"public/" + bucket_key_name}')
        s3.meta.client.copy({"Bucket": bucket, "Key": key}, AMPLIFY_BUCKET, 'public/' + bucket_key_name)
        print(f'Successfully sent image {key} to the amplify storage bucket [the image {pass_or_fail}ed validation]')
        
        response = s3.meta.client.delete_object(Bucket=bucket, Key=key)
        print(f'Successfully deleted image {key} from the validation bucket {bucket}')
    except Exception as e:
        # move to an error folder in the original bucket if an exception was encountered (could be a permissions problem)
        s3.meta.client.copy({"Bucket": bucket, "Key": key}, bucket, f'ERROR/{pass_or_fail}-{key.split("/")[1]}')
        print(f'An error has occured while deleting or moving the image:\n{e}')
        cur.close()
        conn.close()
        raise e
    
    print(f'{time.time() - t:.3f} seconds since invocation. Moved image to Amplify bucket')

    # update the submitted action to include the cloudfront url of the image for display
    sql = f'UPDATE SubmittedAction SET submitted_image="{ CLOUDFRONT_URL + "/" + bucket_key_name}", is_validated={1 if pass_or_fail == "pass" else 0} where sa_id={submitted_action_id};'
    print('Executing statement', sql)
    cur.execute(sql) 
    
    # for the logs only, show the submitted action
    sql = f'SELECT * FROM SubmittedAction where sa_id={submitted_action_id};'
    print('Executing statement', sql)
    cur.execute(sql)
    print(cur.fetchall())

    conn.commit()  # required for statements that have UPDATE
    
    cur.close()
    conn.close()
    print(f'{time.time() - t:.3f} seconds since invocation. Finished execution.')
    return response

# --------------- Main handler ------------------

def lambda_handler(event, context):
    '''
    S3 trigger that uses Rekognition APIs to detect labels in S3 Object.
    This is the handler, meaning this function is called upon Lambda invokation
    '''
    
    # Get the object from the event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    try:
        # Calls rekognition DetectLabels API to detect labels in S3 object
        response = detect_labels(bucket, key)
        print(response)
        return response

    except Exception as e:
        print(e)
        print("Error processing object {} from bucket {}. ".format(key, bucket) +
            "Make sure your object and bucket exist and your bucket is in the same region as this function.")
        raise e
