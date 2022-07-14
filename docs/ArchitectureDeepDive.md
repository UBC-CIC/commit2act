# Backend and Frontend Stack Deep Dive

## Architecture

![Architecture diagram](../docs/images/architecture-diagram.png)

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

### User submitted image validation flow (13-20)

13. An image is uploaded by the user, which is then sent to the Amplify project’s storage S3 Bucket located in the defined region for the project.

14. If the user uploaded image is an image to validate their submitted action, the processImagesToValidate Lambda is invoked upon the image’s placement in the bucket.

15. The validateImageWithRekognition Lambda function invokes the Rekognition detect_labels API call, and the is_image_explicit API call on the uploaded image.

16. Rekognition returns all labels found with their associated confidence values, and a status on the explicit content in the image back to the validateImageWithRekognition Lambda function.

17. The Lambda function gets the valid labels for the action the image was submitted to from the RDS instance, which is then compared against the results of the detect_labels Rekognition function, and if one of the valid labels for the action is found in the image with a confidence greater than a user defined number, the image passes validation (e.g. if the associated action for the image is Transportation, the set of valid labels may be [“Bus”, “Train”, “Bike”, “Shoes”, “Bicycle”], and if any one of these appear in the set of labels returned by Rekognition, the image passes validation).

18. The Lambda function sends the image’s validation status and URL of the image to be stored alongside the submitted action information in the RDS instance (MySQL Aurora DB).

19. The Lambda function sends the image to be stored in the Amplify project’s storage S3 Bucket located in the defined region for the project.

20. The image is hosted through Cloudfront so that it can be displayed when the user runs the app. Cloudfront acts as a content delivery network to allow the efficient display of the static content.





# Backend + AppSync Crash Course

## Schema

The entire backend works around `AWS AppSync`, a serverless `GraphQL` API service. With each call to the AppSync GraphQL API a `resolver` is triggered which will pass along an `SQL` statement to a `Lambda function`, which will then execute the SQL statement on the project's `MySQL RDS instance`. Inside of AppSync, there is a `schema` which acts like the skeleton for AppSync; it provides the structure that the API is built on. The schema contains many different `types`, and these types represent the different tables inside of the RDS instance. For example, in the `User` table these are the columns:

```
 user_id  |   username   |   name        |   email             |  avatar
-----------------------------------------------------------------------------
 1	      |   michael    |   Michael	 |   email@example.ca  |  example.png
```

Here is how the `User` type is defined in the GraphQL schema:

```
type User {
	user_id: Int!
	name: String!
	email: String!
	avatar: String
	username: String
}
```
Here, we are defining the 5 columns in the SQL Table as a `type` with 5 different `fields`, with each field corresponding to a column in the database (the fields are user_id, username, name, email, and avatar). Each type has a `scalar type` (also known as a data type in most other langages) which defines what kind of data each field represents. GraphQL only has a few different scalar types, and these are String, Int, Float, Boolean, and ID. Since these have less resolution than MySQL data types, a GraphQL String just means anything string based. So for example, data types in MySQL like `TEXT`, `VARCHAR(255)`, `DATETIME` are all represented by `String` in GraphQL.

In the Schema Definition Language (SDL), an `!` means that the field cannot be null (so here, the fields user_id, name, and email cannot have null values after a query or mutation is called that returns the `type` User). 

### Custom Scalar Types

It is also possible to define our own scalar types in the schema. These are defined as the following:

```
enum UserRoleInGroup {
	owner
	member
}
```

These can be used exactly the same way as a String or Int to define a type
```
type GroupUser {
	group_id: Int!
	user_id: Int!
	user_role: UserRoleInGroup!
}
```
This means that user_role can only be the strings `"owner"` or `"member"`, and it cannot be null.

### Queries

There are some special types defined within the Schema Definition Language, and the two most important to know about is the `query` type and the `mutation` type. These are defined in the schema as the following:
```
schema {
	query: Query
	mutation: Mutation
}
```
This tells AppSync that the queries are located in the `Query` type, and mutations in the `Mutation` type.

A `query` is a kind of API call that only retrieves data. These can be thought of as essentially just `SELECT` statements. These statements will only read from the data source, and will not modify the data. Here is an example of how it is definied in the schema:

```
type Query {
	getTotalGlobalCO2: Float
    getAllGroups: [Group]
	getSingleGroup(group_id: Int!): Group
}
```

The query type is defined the same way any other type would be defined. For each query that we want to write, the field will be the name of the query (Note: the convention for queries is to write the queries in camelCase, with the name starting with get (however there will be an exception that I will show later on)), and the scalar type will be the data type that will be returned from the query. 

For `getTotalGlobalCO2`, the field is getTotalGlobalCO2 and the scalar type is Float. When the getTotalGlobalCO2 query is called it will execute the SQL statement `SELECT SUM(SubmittedAction.g_co2_saved) AS totalCO2 FROM SubmittedAction WHERE is_validated=1`, which will then get us back a float value (how this specifically executes the statement and returns the value will be described in the Resolvers section of this document).

The `getAllGroups` query demonstrates another scalar type, this query will return a list of Groups. An output may look something like: 

```
[
    {
        "group_id": 10,
        "group_description": "Lorem ipsum dolor sit amet...",
        "is_public": false,
        "group_name": "Group 5",
        "group_image": "https://d11tk3grlajea.cloudfront.net/groupIcons/Group5"
    },
    {
        "group_id": 34,
        "group_description": "This is the description for group 6!",
        "is_public": true,
        "group_name": "Group 6",
        "group_image": "https://d11tk3grlajea.cloudfront.net/groupIcons/Group6"
    }
]
```

The `getSingleGroup` query shows an example of a query that that takes in a `variable`. The variables are defined within the parenthesis next to the field, and there can be as many variables inputted as you need, with each `variable_name: Scalar_type` being separated by a comma. In `getSingleGroup(group_id: Int!): Group`, the variable is the group_id of the group we want to get, and this variable is an integer. If it has an `!`, the variable needs to be passed in. This query will return this single group if `group_id: 34` is passed in:
```
{
    "group_id": 34,
    "group_description": "This is the description for group 6!",
    "is_public": true,
    "group_name": "Group 6",
    "group_image": "https://d11tk3grlajea.cloudfront.net/groupIcons/Group6"
}
```

### Mutations

A `mutation` is defined in a similar way to a query, however what makes mutations different is that they have the ability to modify data in the data source, similar to an `INSERT`, `UPDATE`, or `DELETE` operation in SQL. An important thing to note is that a mutation is still expected to return a value. Here is an example of some mutations:

```
type Mutation {
	createUser(
		name: String!,
		email: String!,
		avatar: String,
		username: String
	): User
    updateGroup(
		group_id: Int!,
		group_name: String,
		group_description: String,
		group_image: String,
		is_public: Boolean,
		private_password: String
	): Group
    deleteQuiz(quiz_id: Int!): String
}
```

For the `createUser` mutation, we are essentially passing in all of the different parameters required to define a User, however we do not need to pass in a user_id, since in the RDS instance we define user_id with the `AUTO INCREMENT` field, which will automatically generate a unique id for the User. The mutation will then return the created user, along with the new user_id. Only the `name` and `email` fields are actually required to be inputted, the other two are optional.

For the `updateGroup` mutation, the only variable that is necessary to input is the group_id, and all the other ones are optional. This lets us only have to actually input whichever fields we want to update. 

For the `deleteQuiz` mutation, we only need to input the quiz_id of the quiz we want to delete, no other fields are necessary. For all the deletes I usually return a String. I do this because it does not make sense to return the deleted object, since that will have been deleted, so I usually just pass back a string thats along the lines of `"Deleted quiz!"`.

### Testing Queries and Mutations


Testing is an important part of making new queries and mutations, and the easiest way to test them is through the `Queries` tab on AppSync. In the image above, we can see the section in the middle of the screen has 3 parts.

The left part lists all queries and mutations currently in the schema. When we select a query or mutation, we can see an option to select exactly which fields we want to be returned to us. A major advantage of GraphQL is that we do not actually need to return all the fields when making an API call, we only need to return whichever fields are important for us at the time. In the image, we have only selected the group_id, group_description, is_public, and group_name fields, so those are the only fields appearing in the resulting array on the right side of the screen.

In the middle of the screen, you can type out exactly whichever queries and mutations you want to test. When selecting a query or mutation on the left of the screen, this middle section is automatically populated with the  statement that will be executed.

To execute a query or mutation, we just need to click the orange play button in the top middle of the screen. This will then ask us which query or mutation we want to run. The returned result will appear on the right. Before running, I recommend making sure the checkbox named `LOGS` is checked (located in the bottom right), as this will give you a quick link to access the CloudWatch logs for that statement's execution, which helps with debugging. This hyperlink appears on the `VIEW IN CLOUDWATCH` text that appears after execution (NOTE: make sure logging is enbled in the Settings tab on AppSync).

Also prior to running, it is important to be logged in via `Cognito User Groups`. Since the API is configured to be autheticated through Cognito User Groups, we need to log in as a user that is in the group in order to run any statements.

### Custom Types

In the project's schema, there are also many other types defined. When we write a query or mutation, it is possible we would want the result of two or more tables joined together as the response. When we start making more complicated queries and mutations, we will need to define custom types that don't just correspond with just one table. 

One example of this is the `getUserStatsForGroup(user_id: Int!, group_id: Int!): UserGroupStats` query. The UserGroupStats type is the following:

```
type UserGroupStats {
	user_id: Int
	group_id: Int
	total_co2: Float
	total_points: Int
	weekly_co2: Float
	weekly_points: Int
}
```

Since for the frontend, we decided that a query that gets these metrics for a user in a group would be important, I made a new type to return the values we actually need. 

## Resolvers



Resolvers are an extremely important part of AppSync to know about, since resolvers are how queries and mutations get connected to the datasource in the backend. There are many different ways to configure resolvers, but this guide will just describe the setup used for this project. 

### Creating and Accessing Resolvers

To create a new resolver for a query or mutation, first navigate to the `Schema` tab on the AppSync console. On the right of the screen, there will be a large section devoted to resolvers. Scroll down the list until you find the query or mutation that you want to make the resolver for. There should be a button named called `Attach` next to the name of the query or mutation, and clicking that will bring you to a new screen with the resolver information.

The first bit of information that is required to be entered is the `Data source name`. This is asking where exactly should AppSync look for the data when the query is executed. In this project, we have already configured a Lambda function as our data source (the Lambda code can be viewed under /lambda_functions/GraphQLMySQLResolver/index.js), and this is called `LambdaHandler`. 

Selecting the LamdbdaHandler as our data source, we then see two toggles that we need to switch on, and these are `Enable request mapping template` and `Enable response mapping template`. These mapping templates are how the resolvers work, and they are written in [VTL (Velocity Template Language)](https://velocity.apache.org/engine/1.7/user-guide.html), and while it is not essential to understand the language, it will be helpful in cases where more complicated resolvers are required.

After filling in values for both mapping templates, press the `Save Resolver` button in the top right to save the resolver. To modify the resolver in the future, scroll on the same right panel in the main screen until you find the query/mutation you want to modify, then click on the text that says `LambdaHandler` (you may have to scroll to the right on the panel to see the text).

> *NOTE: The AppSync console is extremely awkward to work with at times. I have had several cases where I will just suddenly lose some of my resolvers. The best way to avoid this is to only have 1 single tab for working on resolvers. Working on multiple resolvers at once can cause glitches as when you try to save one, it may overwrite another.*

#### Request Mapping Templates

The `request mapping template` is a way to transform the data recieved from the GraphQL query/mutation into a form that our data source can understand. Since our data source is a Lambda function, we need to transform the data into a JSON object. The `payload` JSON object will be passed to the Lambda function as an input after VTL has evaluated any logic in our resolver. There is a very specific format required for the request mapping templates so that the Lambda will execute correctly, and it is the following:
```
{
    "version" : "2017-02-28",
    "operation": "Invoke",
    "payload": {
        "sql": "SQL STATEMENT TEXT HERE",
        "variableMapping": {
            "key": $argumentfrominput
        }
        "responseSQL": "OPTIONAL FIELD, SQL STATEMENT TO BE EXECUTED AFTER THE FIRST `sql` IS RUN"
  }
}
```
This is the JSON object that the Lambda will recieve. Here is a concrete example of how it looks for the `addGroupMember` mutation:
```
{
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
        "sql": "INSERT INTO `GroupUser` (group_id, user_id, user_role) VALUES (:1, :2, 'member')",
        "variableMapping": {
            ":1": $context.arguments.group_id, 
            ":2": $context.arguments.user_id
        },
        "responseSQL": "SELECT * FROM `GroupUser` WHERE group_id=:1 AND user_id=:2"
    }
}
```
The `"sql"` key contains the SQL statement we want to execute first. In this case, we want to insert into the GroupUser table a group_id, a user_id, and set the user_role to "member". The group_id and user_id are arguments that are passed in from GraphQL, and how we actually get the values of these input arguments into the SQL statement is through the `"variableMapping"` JSON object. This contains a key-pair combo for every user defined argument that we want to pass into the SQL statements. In VTL, the `$` symbol means the following text is a variable (or a special AppSync operation, which we will see later), and AppSync automatically populates each `$context.arguments.INPUT_VARIABLE_NAME` for all inputted variables to the statement. In the Lambda, it will look for the first instance of each variable mapping key (for example, `:1`) inside of the actual sql string, and then it will replace the key with the corresponding value in variableMapping (if the passed in group_id was 10, then the first instance of :1 found in the sql string will be replaced with the value 10).

> *NOTE: It is really important to know that the Lambda only replaces the **first** instance of the key in the sql string, any subsequent instances of :1 in the string will not be replaced with 10)*

The same principle applies to the `"responseSQL"` key. This statement is used inside of mutations to get a return value back to GraphQL. The Lambda will execute this statement after the initial sql statement. The same variableMapping object will be applied to responseSQL.

> *NOTE: The value for `"version"` should not really matter, "2017-02-28" or "2018-05-29" work just fine*

The contents of `variableMapping` will depend on exactly what the inputs to a query/mutation are. In the case where there are no inputs, we can just make it an empty JSON object. Here is an example from `getAllSubmittedActions`:
```
{
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
    "sql": "SELECT * FROM `SubmittedAction`",
    "variableMapping": {},
    }
}
```

One really important thing to keep in mind when putting the variables in variableMapping is that which scalar type the variable is will define how variableMapping will look. When the argument's scalar type is a `String`, the VTL variable should be surrounded with double quotes. Here is an example for the query `createSubmittedActionItem`
```
{
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
    "sql": "INSERT INTO `SubmittedActionItem` ( item_name, sa_id, input_value ) VALUES (:1, :2, :3)",
    "variableMapping": {
        ":1": "$context.arguments.item_name", 
        ":2": $context.arguments.sa_id, 
        ":3": $context.arguments.input_value
    },
    "responseSQL": "SELECT * FROM `SubmittedActionItem` WHERE item_name=:1 AND sa_id=:2"
    }
}
```

Above, the `item_name` argument is a `String`, so we have to wrap it with double quotes. The `sa_id` and `input_value` are both numberical, so we do not need quotes for them. A `Boolean` can be entered the same way as an `Int` or a `Float`.

#### Response Mapping Templates

A `Response mapping template` acts in a similar way to its request counterpart, however this one will transform the returned values from the Lambda function into a format that GraphQL will be happy with. There are really only 3 different ways a response mapping template will look, and it just depends on what the returning type is.

If the returning type is a normal type not in an array (like the `getSingleGroup` query, it should return 1 object of type `Group`), the response mapping template should just be:
```
$util.toJson($context.result[0])
```
This `$util.toJson` function is incredibly important for the response mapping templates, it essentially just turns the output from the Lambda into a format that GraphQL will be able to read. The `$context.result[0]` just means "get the first element from the result of the Lambda", since the Lambda returns everything in the form of an array `[0]` is important to include to get the return type to not be a list.

If the returning type is an array of a certain type (like `getAllGroups`, this returns type `[Group]`), the reponse mapping template will just look like
```
$util.toJson($context.result)
```

In the event that the return type is a scalar type (like in the query `getTotalGlobalCO2` the return type is `Float`), the reponse mapping template will look a little more complicated, and uses a bit of VTL logic to work:
```
#if ($context.result[0].get("totalCO2"))
    $util.toJson($context.result[0].get("totalCO2"))
#else
    0.0
#end
```
This will return the float value for the SQL column `totalCO2` from the statement `select SUM(SubmittedAction.g_co2_saved) AS totalCO2 from SubmittedAction where is_validated=1` if the value exists. If the value does not exist (i.e. the query returned null, which will happen if the SubmittedAction table does not have any actions where `is_validated=1`) we just return a value of `0.0`.


### Advanced Mapping Templates

For some of the resolvers, I used some complicated logic in order to achieve the desired result for a query or mutation. This section will go over some of the techniques I used.

#### createSubmittedActions

The following query shows an example of using VTL logic outside of the main JSON object to handle a situation where no quiz_id is provided, since this is an optional field. This is a large template, so try not to feel overwhelmed! The important details are in the very first 3 lines before the first `{`.

```
#if( !$context.arguments.quiz_id )
    #set( $context.arguments.quiz_id = '""' )  #** VTL evaluates this to an empty string "" **#
#end
{
    "version": "2018-05-29",
    "operation": "Invoke",
    "payload": {
        "sql": "INSERT INTO `SubmittedAction` ( user_id, action_id, quiz_id, g_co2_saved, date_of_action, first_quiz_answer_correct, quiz_answered, is_validated, points_earned, time_submitted, is_rejected, is_image_explicit ) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, current_timestamp(), 0, 0)",
        "variableMapping": {
            ":1": $context.arguments.user_id, 
            ":2": $context.arguments.action_id, 
            ":3": $context.arguments.quiz_id,
            ":4": $context.arguments.g_co2_saved,
            ":5": "$context.arguments.date_of_action",
            ":6": $context.arguments.first_quiz_answer_correct,
            ":7": $context.arguments.quiz_answered,
            ":8": $context.arguments.is_validated,
            ":9": $context.arguments.points_earned,
        },
        "responseSQL": "SELECT * FROM `SubmittedAction` WHERE user_id=:1 AND action_id=:2 AND g_co2_saved=:4 AND date_of_action=:5 AND first_quiz_answer_correct=:6 AND quiz_answered=:7 AND is_validated=:8 AND points_earned=:9 ORDER BY time_submitted DESC"
    }
}
```

Here, we are checking if the quiz_id variable was passed in. If it was not provided as an argument, we will set the `$context.arguments.quiz_id` variable to be `'""'`. There is some logic inside of the lambda to set an empty string to a null, so if quiz_id is not provided, we just set it to null in the INSERT. We have to do this when quiz_id is not a string value. After the first three lines are evaluated by VTL, `$context.arguments.quiz_id` is guaranteed to have a value. If we did not do the `#set` operation, the variable mapping may end up looking like this in the event quiz_id isn't set after VTL evaluation (with example values):
```
"variableMapping": {
    ":1": 1, 
    ":2": 2, 
    ":3": $context.arguments.quiz_id,
    ":4": 12.5,
    ":5": "2022-06-09 18:39:44",
    ":6": false,
    ":7": false,
    ":8": false,
    ":9": 12.5,
},
```
This will cause VTL to throw an error, since it will not know what `$context.arguments.quiz_id` is.

In the event you want to conditionally set a String variable, it will in be a similar way:
```
#if( !$context.arguments.group_description )
    #set( $context.arguments.group_description = '' ) 
#end
```
