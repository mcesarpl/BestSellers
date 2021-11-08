# BestSellers

Get the ten best sellers books on Amazon using aws serverless environment

<!--
title: 'Top 10 Best Sellers on Amazon Watcher'
description: 'This template demonstrates how to deploy a NodeJS function running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v2
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Description

This project works with a NodeJS lambda function running on AWS using the traditional Serverless Framework. Once deployed, you got access by GET `event` to a function that returns an array with the top ten best-sellers books of Amazon on that day. Another function deployed makes the scraping info once a day, triggered in a `cron`-like manner. The scraper function saves the information on DynamoDB, thus making the information available for the first lambda. For details about configuration of serverless, please refer to our [documentation](https://www.serverless.com/framework/docs/providers/aws/events/).

### Deployment

In order to deploy, you need to run the following command:

Test:

```
$ serverless deploy --stage qa
```

Production:

```
$ serverless deploy --stage prod
```

After running deploy, you should see output similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Installing dependencies for custom CloudFormation resources...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service BestSellers.zip file to S3 (53.14 MB)...
Serverless: Uploading custom CloudFormation resources...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...........................................................................
Serverless: Stack update finished...
Service Information
service: BestSellers
stage: prod
region: us-east-1
stack: BestSellers-prod
resources: 26
api keys:
  None
endpoints:
  GET - https://99999999.execute-api.us-east-1.amazonaws.com/prod/todaylist
functions:
  scraping: BestSellers-prod-scraping
  getTodayList: BestSellers-prod-getTodayList
layers:
  None
Serverless: Publishing service to the Serverless Dashboard...
Serverless: Successfully published your service to the Serverless Dashboard: https://app.serverless.com/xxxxx/apps/bestsellers/BestSellers/prod/us-east-1
```

### Invocation

After successful deployment, you can invoke the scraping function by using the following command:

```bash
serverless invoke --function scraping
```

Which should result in response similar to the following:

```json
{
  "statusCode": 200,
  "body": "Itens created with success!"
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function getTodayList
```

Which should result in response similar to the following:

```
{
    "statusCode": 200,
    "body": "[
      {\"rating\":\"4.8 out of 5 stars\",\"ranking\":\"#7\",\"createdAt\":\"Mon Nov 08 2021\",\"writer\":\"Adam Wallace\",\"price\":\"$7.58\",\"title\":\"How to Catch a Turkey\"},
    ...
    ]"
}
```
