# Intro

The Commit2Act solution can be deployed onto your AWS account through this guide. Using AWS Amplify and CloudFormation, we can create all the necessary resources in your own accounts in order to have the solution built in the cloud. This whole process should take around 45-60 minutes, with most of the time spent waiting for resources to provision and build in your account.

# Requirements

Before you deploy, you must have the following accounts created:

- [AWS Account](https://aws.amazon.com/account/)
- [GitHub Account](https://github.com/)

You will also need the following installed on your computer:

- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)

# Step 1: Clone The Repository

First, clone the GitHub repository onto your machine. To do this:

1. Create a folder on your computer to contain the project code.
2. For an Apple computer, open Terminal. If on a Windows machine, open Command Prompt or Windows Terminal. Enter into the folder you made using the command `cd path/to/folder`. To find the path to a folder on a Mac, right click on the folder and press `Get Info`, then select the whole text found under `Where:` and copy with ⌘C. On Windows (not WSL), enter into the folder on File Explorer and click on the path box (located to the left of the search bar), then copy the whole text that shows up.
3. Clone the github repository by entering the following:

```bash
git clone https://github.com/UBC-CIC/commit2act.git
```

The code should now be in the folder you created. Navigate into the frontend folder containing the Amplify project by running the command:

```bash
cd commit2act
```

# Step 2: Frontend Deployment

Before installing Amplify we need to create the IAM Role that gives us the permissions needed to implement this solution. Run the following line of code:

```bash
aws cloudformation deploy --template-file cfn-amplifyRole.yaml --stack-name amplifyconsole-commit2act-backend-role --capabilities CAPABILITY_NAMED_IAM
```

If you have multiple AWS Profiles, specify one with sufficient admin permissions by appending the following text to the end of the command, replacing the profile name with the profile you would like to use for the solution (If you do this, be sure to include the same `--profile` argument for the rest of the commands starting with `aws`. The profile you are using for this project should have administrator privliges).

```bash
--profile [PROFILE NAME]
```

This step creates the IAM role called **amplifyconsole-commit2act-backend-role** that will be used on the next step.

The **Deploy to Amplify Console** button will take you to your AWS console to deploy the front-end solution.

<a href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/UBC-CIC/commit2act">
    <img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify Console">
</a>

1. On the AWS console. select your region on the top right, then connect to GitHub. The region you deploy to has to be one of the following, or the process will fail: [us-east-1, us-east-2, us-west-1, us-west-2, ap-south-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2, eu-central-1, eu-west-1, eu-west-2]![Amplify console main screen](images/amplify-console-01.PNG)
2. Select the **amplifyconsole-commit2act-backend-role** we made previously for the deployment role, and then press the orange button at the bottom of the page, and then press `Continue` when that pops up![alt text](images/amplify-console-02.png)
3. The deployment will take a few minutes. Wait until the status shows **Verify** in green![alt text](images/amplify-console-03.png)
4. Click on left taskbar to open menu, click on Rewrites and redirects, and click on edit![alt text](images/amplify-console-04.png)
5. Click and replace the first rule's source address (or add a rule if there is none) to `</^((?!\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>`, click and replace target address to `/index.html`, and select and replace **type** with `200 (Rewrite)`, then save. Add a second rule, with the source address as `</^((?!\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>`, the target address as `/index.html`, and the **type** with `404 (Rewrite)`.
   Refer to [AWS's Page on Single Page Apps](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) for further information on why we did that
   ![alt text](images/amplify-console-05.png)

The frontend is almost finished being set up, but first we need to deploy our backend.

# Step 3: Backend Deployment

It's time to set up everything that goes on behind the scenes! For more information on how the backend works, feel free to refer to the Architecture Deep Dive, but an understanding of the backend is not necessary for deployment.

The first step is to get into the backend folder. This can be done with the following command:

```bash
cd backend
```

From here, we are going to run the CloudFormation template. This template will automatically provision the backend resources in your AWS account.

```bash
sam deploy --guided --capabilities CAPABILITY_NAMED_IAM --stack-name <stack-name-of-your-choosing>
```

NOTE: Be sure to include the `--profile <AWS PROFILE>` to the end of the command if you used it in the previous step!

After running this, you will be prompted with a series of settings to fill in. When there is text in `[square brackets]`, that means whatever is inside is the default value. If you are satisfied with that value for the input, you can just press enter. 

If at any point you make a typo, you can press CTRL+C to cancel the process, and then you can re-run the command

The following block of text is what will appear when running the command. It is a series of inputs to enter into the template, which will go line by line. Any text in `[square brackets]` is part of what will appear on screen, and these are the default values. If you are satisfied with that value for the input, you can just press enter. If there is no text in the brackets, that means it is required you enter something yourself as the input. Text in `<angled brackets>` has been added by me to help explain what to input. If there are no angled brackets, that means it is recommended just to use the default value provided, however they can be modified if wanted. Any text in `(rounded brackets)` will appear below a certain input. This will tell any important information to know about the input that is above. Spacing has been added for clarity.

```
Configuring SAM deploy
======================
   Looking for config file [samconfig.toml] :  Not found
      (this will appear on first invokation, this file can be added to later to save the inputs we used so we do not have to re-enter them on subsequent deployments)

   Setting default arguments for 'sam deploy'
   =========================================
   Stack Name [commit2act]:
      (This will be the name of the stack you entered when running sam deploy, just press enter)
   AWS Region []: <REGION YOU WANT TO DEPLOY TO>
      (Ensure that you enter the same exact region you used to deploy Amplify in)
   Parameter ProjectName []:
      (This can be anything you want)
   Parameter EnvironmentName [dev]:
      (This is just to differentiate between different builds, e.x. you can have dev, prod, and test environemnts)
   Parameter DBName [sys]:
      (Name of the database, sys is the standard name, must begin with a letter and contain only alphanumeric characters, and be 16 characters or less)
   Parameter DBUser [admin]:
      (Name of the username to log into the database with, must begin with a letter and contain only alphanumeric characters, and be 16 characters or less)
   Parameter DBPassword []: <YOUR DB PASSWORD>
      (Password to use for the database, must contain only alphanumeric characters, and be between 8-40 characters)
   Parameter DBInstanceClass [db.t4g.large]:
      (What size of database to use. This value can be changed later in RDS settings, however there will be some downtime associated with it. For more information visit https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html. The allowed values are db.t2.small, db.t2.medium, db.t3.small, db.t3.medium, db.t4g.medium, db.t4g.large, db.r4.large, db.r4.xlarge, db.r4.2xlarge, db.r4.4xlarge, db.r4.8xlarge, db.r4.16xlarge, db.r5.large, db.r5.xlarge, db.r5.2xlarge, db.r5.4xlarge, db.r5.8xlarge, db.r5.12xlarge, db.r5.16xlarge, db.r6g.large, db.r6g.xlarge, db.r6g.2xlarge, db.r6g.4xlarge, db.r6g.8xlarge, db.r6g.12xlarge, db.r6g.16xlarge)
   Parameter DBEngineVersion [5.7.mysql_aurora.2.09.2]:
      (What version of MySQL Aurora to use, the default value is recommended, but any of the following allowed values should work: 5.7.mysql_aurora.2.07.0, 5.7.mysql_aurora.2.07.1, 5.7.mysql_aurora.2.07.1, 5.7.mysql_aurora.2.07.2, 5.7.mysql_aurora.2.07.3, 5.7.mysql_aurora.2.07.4, 5.7.mysql_aurora.2.07.5, 5.7.mysql_aurora.2.07.6, 5.7.mysql_aurora.2.07.7, 5.7.mysql_aurora.2.08.0, 5.7.mysql_aurora.2.08.1, 5.7.mysql_aurora.2.08.2, 5.7.mysql_aurora.2.08.3, 5.7.mysql_aurora.2.08.4, 5.7.mysql_aurora.2.09.0, 5.7.mysql_aurora.2.09.1, 5.7.mysql_aurora.2.09.2, 5.7.mysql_aurora.2.09.3, 5.7.mysql_aurora.2.10.0, 5.7.mysql_aurora.2.10.1, 5.7.mysql_aurora.2.10.2,  8.0.mysql_aurora.3.01.0, 8.0.mysql_aurora.3.01.1, 8.0.mysql_aurora.3.02.0)
   Parameter DeletionProtection [True]:
      (When deletion proteciton is enabled, when you request the deletion of a database instance in the AWS Console you are blocked and may not continue without first modifying the instance and disabling deletion protection (recommended for production))
   Parameter EncryptDatabase [True]:
      (Encrypts the database for added security)
   Parameter CloudFrontPriceClass [PriceClass_100]:
      (The price class for the CloudFront Distriution, more info on which may be best for you can be found at https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html, however the default value will work perfectly fine for North American deployments. Allowed values: PriceClass_100, PriceClass_200, PriceClass_All)
   Parameter MinConfidenceThreshold [70]:
      (The minimum percent confidence required to accept a label during image validation with Rekognition, from our testing 70 is the best to use, but it can be modified)
   Parameter CognitoAdminName []: <NAME TO USE FOR ADMIN ACCOUNT>
      (For the first administrator user, whatever name you want associated to the account, can be your full name, or any other name you want)
   Parameter CognitoAdminEmail []: <EMAIL TO USE FOR ADMIN ACCOUNT>
      (For the first administrator user, what ever email you want associated to the account. This will be used for login, and you will receive a temporary passowrd to this email for your first login)

   #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
   Confirm changes before deploy [y/N]: y
      (This is good to turn on just to ensure everything is ready to be deployed)
   #SAM needs permission to be able to create roles to connect to the resources in your template
   Allow SAM CLI IAM role creation [Y/n]:
      (Here you can just press enter, the capital Y means that just pressing enter counts as a yes)
   #Preserves the state of previously provisioned resources when an operation fails
   Disable rollback [y/N]:
      (Here you can just press enter, the capital N means that just pressing enter counts as a no)
   Save arguments to configuration file [Y/n]:
      (This will allow any future deployments of this stack to use the inputs you just entered, saving some time)
   SAM configuration file [samconfig.toml]:
      (This file will be made for you, just press enter)
   SAM configuration environment [default]:
      (You can have multiple different environments, each having different saved inputs, but for now just press enter since we do not need to worry about that for this deployment)
```

Be sure to not close the window after this process has completed, as the Outputs section produced will be imortant for the next step.

# Step 4: Set up Lambda Trigger

In order for the project to work as intended, we need to set up a trigger for our image validation Lambda function that will let it be called whenever an image file is uploaded to our Amplify S3 Bucket.

To do this we will use AWS CDK (Cloud Development Kit).

Run the command

```
cdk --version
```

it will print a version like this:

```
2.41.0 (build 6ad48a3)
```

If you do not have cdk installed please look at step 1 on how to install the cdk software.

Type the following commands in to set up the lambda trigger

```
cd cdk
```

```
cdk bootstrap
```

For the third command you need to input your Cloud Front Origin Access Identity into the command.
This value should have been printed to the console in step 3.


```
cdk deploy --parameters CloudFrontOriginAccessIdentity=<Your Cloud Front Origin Access Identity>
```

An example of how the command should look is:

```
cdk deploy --parameters CloudFrontOriginAccessIdentity=EEXI7YLO7EN3A
```

# Step 5: Wrap up Frontend Deployment

We need to add one more thing to our Amplify project before we are all done with deploying.

1. Copy the CloudFormation output called CloudFrontDistributionDomainName

2. On the [AWS console](https://console.aws.amazon.com/console/home), Navigate back to the amplify console by entering **Amplify**. Under the App Settings heading on the left hand sidebar, click `Environment Variables`. Click on `Manage variables`, and create an environment variable with the Variable field as `REACT_APP_CLOUDFRONT_DOMAIN_NAME`, and the Value as the Distribution Domain Name that was copied in the previous step.
   ![alt text](images/amplify-console-08.png)

3. Go back to the amplify console screen for the commit2act app. Under the `Hosting Environments` tab, click the **main** branch.
   ![alt text](images/amplify-console-06.png)

4. Click the `Redeploy this version` button to rebuild the app with the updated environment variables
   ![alt text](images/amplify-console-07.png)

Congratulations, your web app is now deployed! You can find the website URL on the main screen of Amplify under `Hosting environments`, and then clicking on the web-browser-esque image under `main`.

# Step 6: Log into Admin Account

To use the account created with CloudFormation, first navigate to the link of the app. This can be found on the Amplify page, under `Hosting environments`. Clicking on the image below `main` will take you to the website. Then, just log in to the account using the email you provided in the template. For the password, a temporary one will have been sent to your inbox. After logging in, you will be instructed to choose a brand new password.

# Step 7 (Optional): Set up other Admin Accounts

To set up other accounts as an admin, you will need to do the following steps. (Note: this assumes the user has already been registered on the app)

1. At the [AWS online console](https://console.aws.amazon.com/console/home), enter `Cognito` in the search bar \
   ![alt text](images/webapp3.png)
2. Select `Manage User Pools` (or click `User pools` on the left of the screen), then select the user pool corresponding to the project name (ex. `commit2act-env`) \
   ![alt text](images/webapp4.png)
3. Click the `Users and Groups` tab on the menu on the left of the screen (if you are on the newer version of the Cognito Console you can scroll down to see the users), then select the user which you want to set to Admin \
   ![alt text](images/webapp5.png)
4. Scroll down to User Attributes, and click `Edit` \
   ![alt text](images/webapp6.png)
5. Scroll down to Option Attributes, and change the value in the `custom:type` field from _User_ to _Admin_. Click `Save Changes`\
   ![alt text](images/webapp7.png)
6. You have set up login credentials. Return to Commit2Act web app, and login. Your user is now an admin! (If the user does not see the Admin Dashboard tab, try relogging on the Commit2Act web app)

# Troubleshooting

### Error #1

If you encounter the following error:

```bash
The config profile could not be found
```

Then chances are that the AWS CLI has not been correctly configured. Ensure you have correctly done so by following the [AWS CLI setup guide](https://aws.amazon.com/cli/), as indicated in the requirements section.
