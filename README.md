# Serverless Photo

Capstone project for a simple Photo Gallery application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching photo items. Each photo item can optionally have an attachment image. Each user only has access to photo items that he/she has created.

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. 


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless photo application.

# Postman collection

An alternative way to test API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. API endpoints as below.

GET - https://k8htrgpfrh.execute-api.us-east-2.amazonaws.com/dev/photos
POST - https://k8htrgpfrh.execute-api.us-east-2.amazonaws.com/dev/photos
PATCH - https://k8htrgpfrh.execute-api.us-east-2.amazonaws.com/dev/photos/{photoId}
DELETE - https://k8htrgpfrh.execute-api.us-east-2.amazonaws.com/dev/photos/{photoId}
POST - https://k8htrgpfrh.execute-api.us-east-2.amazonaws.com/dev/photos/{photoId}/attachment

