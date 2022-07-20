# Requirements

Before you deploy, you must have the following installed on your device:

- [AWS Account](https://aws.amazon.com/account/)
- [GitHub Account](https://github.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

If you are on a Windows device, it is recommended to install the [Windows Subsystem For Linux](https://docs.microsoft.com/en-us/windows/wsl/install), which lets you run a Linux terminal on your Windows computer natively. This will simplify later steps. [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701) is also recommended for using WSL.

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

If you have multiple AWS Profiles, specify one with sufficient admin permissions by appending the following text to the end of the command, replacing the profile name with the profile you would like to use for the solution.

```bash
--profile [PROFILE NAME]
```

This creates the IAM role called **amplifyconsole-commit2act-backend-role** that will be used on the next step.

The **Deploy to Amplify Console** button will take you to your AWS console to deploy the front-end solution.

<a href="https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/UBC-CIC/commit2act">
    <img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify Console">
</a>

1. On the AWS console. select your region on the top right, then connect to github![alt text](images/amplify-console-01.png)
2. Select the **amplifyconsole-commit2act-backend-role** for deployment![alt text](images/amplify-console-02.png)
3. The deployment will take a few minutes. Wait until the status shows **Verify** in green![alt text](images/amplify-console-03.png)
4. Click on left taskbar to open menu, click on Rewrites and redirects, and click on edit![alt text](images/amplify-console-04.png)
5. Click and replace the first rule's source address (or add a rule if there is none) to `</^((?!\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>`, click and replace target address to `/index.html`, and select and replace **type** with `200 (Rewrite)`, then save. Add a second rule, with the source address as `</^((?!\.(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$).)*$/>`, the target address as `/index.html`, and the **type** with `404 (Rewrite)`.
   Refer to [AWS's Page on Single Page Apps](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa) for further information on why we did that
   ![alt text](images/amplify-console-05.png)


The frontend is almost finished being set up, we just need to create our backend resources first.

# Step 3: Backend Deployment

It's time to set up everything that goes on behind the scenes! For more information on how the backend works, feel free to refer to the Architecture Deep Dive, but an understanding of the backend is not necessary for deployment.

The first step is to get into the backend folder. This can be done with the following command:

```bash
cd backend
```

From here, we are going to run the CloudFormation template. This template will automatically provision the backend resources in your AWS account.

We will need some information from the Amplify project 

```bash

```

Be sure to not close the window after this process has completed, as the Outputs section produced will be imortant for the next step.

# Step 4: Set up Lambda Trigger

In order for the project to work as intended, we need to set up a trigger for our image validation Lambda function that will let it be called whenever an image file is uploaded to our Amplify S3 Bucket. There are two ways to do this. If you are on an Apple Computer, Linux, or using the Windows Subsystem for Linux (ensuring that you have AWS set up on these systems), you can run a script to set this up. If you are on a standard Windows machine, you must follow a manual process.


If on a Mac, Linux, or WSL instance (making sure you are in the backend directory), run the following command:
```bash
./scripts/lambda_trigger.sh <AmplifyBucketName> <ValidationFunctionARN>
```

This will set up the Lambda trigger. The two required parameters will have been outputted from the previous CloudFormation step, but if that window was closed the outputs can be found on the AWS Console by searching for `CloudFormation`, clicking on the stack called [STACKNAME], then navigating to the `Outputs` tab (making sure you are in the same region that you deployed to). The command should look something like:
```bash
./scripts/lambda_trigger.sh projectname-storage-0123456789abcd-develop arn:aws:lambda:us-east-1:012345678901:function:validateImageWithRekognition
```

Running this will set up the trigger, and you can move on to the next step.

If you are on a Windows machine, or for whatever reason you encounter errors with the command, the trigger can be added with relative ease through the AWS Console.

# Step 5: Wrap up Frontend Deployment

We need to add one more thing to our Amplify project before we are all done with deploying. 

1. Copy CloudFormation output called CloudFrontDistributionDomainName that appeared at the end of Step 3

//add image

2. On the [AWS online console](https://console.aws.amazon.com/console/home), Navigate back to the amplify console by entering **Amplify**. Under the App Settings heading on the left hand sidebar, click Environment Variables. Add an environment variable with the Variable field as `REACT_APP_CLOUDFRONT_DOMAIN_NAME`, and the Value as the Distribution Domain Name that was copied in the previous step.

// add image


Congratulations, your web app is now deployed!


# Step 6: Register Admin Account

Here, you'll learn how to register for an account on the web app, then how to set any accounts to Commit2Act Admin.

1. At the login page for the Commit2Act website, click create an account \
   ![alt text](images/webapp0.png)
2. Enter Account Details and click Sign-up. **Verification code is sent to email.** \
   ![alt text](images/webapp1.png)
3. User retrieves verification code from email and enters it to Verify Account\
   ![alt text](images/webapp2.png)
4. At the [AWS online console](https://console.aws.amazon.com/console/home), enter **Cognito** in the search bar \
   ![alt text](images/webapp3.png)
5. Select the user pool corresponding to the project name (Default commit2act-deve) \
   ![alt text](images/webapp4.png)
6. Select the user which you want to set to Admin \
   ![alt text](images/webapp5.png)
7. Scroll down to User Attributes, and click **Edit** \
   ![alt text](images/webapp6.png)
8. Scroll down to Option Attributes, and change the value in the **custom:type** field from _User_ to _Admin_. Click **Save Changes**\
   ![alt text](images/webapp7.png)
9. You have set up login credentials. Return to Commit2Act web app, and login. Your user is now a Commit2Act Admin! (If you are having issues, try relogging on the Commit2Act web app)

# Troubleshooting

### Error #1

If you encounter the following error:

```bash
The config profile could not be found
```

chances are that the AWS CLI has not been correctly configured. Ensure you have correctly done so by following the [AWS CLI setup guide](https://aws.amazon.com/cli/), as indicated in the requirements section.
