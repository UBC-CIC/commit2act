# Backend and Frontend Stack Deep Dive

## Architecture

![alt text](../docs/images/architecture-diagram.png)

## Description

1. Users navigate to the Commit2Act website in their web browser.

2. The user signs-in to access the website’s content through Amazon Cognito, which assigns them different permissions depending on if they are an administrator or a user.

3. An API call is made to the GraphQL API by the web client.

4. The GraphQL API call is converted to a JSON object through a request mapping template, which includes an SQL statement and the list of variables passed in, and is passed along as input to the GraphQL-MySQL-Resolver Lambda function.

5. The Lambda function invokes the SQL statement provided in the request mapping template by connecting to the RDS Proxy endpoint for the RDS instance.

6. The RDS Proxy establishes a connection to the RDS instance, and manages the connections for any other currently running instances of the GraphQL-MySQL-Resolver Lambda function. The proxy will then pass along the desired SQL statement to the RDS instance.

7. If the SQL statement is a SELECT, the RDS will return the desired rows from the database, otherwise it will return a HTTP 200 OK response code upon a successful invocation of the command.

8. The result of the SQL statement is passed along, and if no further commands will occur the RDS Proxy will then terminate the connection.

9. The result of the SQL statement is returned from the GraphQL-MySQL-Resolver Lambda function.

10. If there are rows or values to be returned, they are transformed into a JSON object through the response mapping template.

11. When static content is to be displayed, such as user avatars, the image will be displayed through Cloudfront.

12. All Cloudfront image links are stored in the RDS instance so they can be returned upon database queries.

### User submitted image validation flow (13-22)

13. An image is uploaded by the user, which is then sent to the Amplify project’s storage S3 Bucket located in the defined region for the project.

14. If the user uploaded image is an image to validate their submitted action, the processImagesToValidate Lambda is invoked upon the image’s placement in the bucket.

15. The processImagesToValidate Lambda function moves the image from the Amplify storage bucket to a separate validation bucket which is in a user defined region where Rekognition is available. If the Amplify bucket is in the same region as the validation bucket, no additional cost is incurred.

16. The validateImageWithRekognition lambda function is invoked after the image is received in the validation S3 bucket.

17. The validateImageWithRekognition Lambda function invokes the Rekognition detect_labels function on the uploaded image.

18. Rekognition returns all labels found with their associated confidence values to the validateImageWithRekognition Lambda function.

19. The Lambda function gets the valid labels for the action the image was submitted to from the RDS instance, which is then compared against the results of the detect_labels Rekognition function, and if one of the valid labels for the action is found in the image with a confidence greater than a user defined number, the image passes validation (e.g. if the associated action for the image is Transportation, the set of valid labels may be [“Bus”, “Train”, “Bike”, “Shoes”, “Bicycle”], and if any one of these appear in the set of labels returned by Rekognition, the image passes validation).

20. The Lambda function sends the image to be stored in the Amplify project’s storage S3 Bucket located in the defined region for the project.

21. The Lambda function sends the image’s validation status and URL of the image to be stored alongside the submitted action information in the RDS instance (MySQL Aurora DB).

22. The image is hosted through Cloudfront so that it can be displayed when the user runs the app. Cloudfront acts as a content delivery network to allow the efficient display of the static content.
