
import serverlessExpress from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app/app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${process.env.API_PREFIX}/${process.env.API_VERSION}`);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(event)
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};


handler({
  resource: '/api/v1/almacenar',
  path: '/api/v1/almacenar',
  httpMethod: 'POST',
  headers: {
    'Accept-Encoding': 'gzip, deflate',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '265691',
    'CloudFront-Viewer-Country': 'PE',
    Host: '9fkjsjl0r5.execute-api.us-east-1.amazonaws.com',
    'User-Agent': 'vscode-restclient',
    Via: '1.1 f2b25186ddd6c6eba84de9b968deb3f0.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'IArGYJnnlw03YVNphDzGhlxerOi_WpyTgtMf7nlbJDKYG1rJnCKruw==',
    'X-Amzn-Trace-Id': 'Root=1-67d764cd-7c582a6d78c8d7251bc902ca',
    'x-api-key': '1oPS7zIZJQ9mvxMi19qjD9MsV2P6RxIP12ctiWgt',
    'X-Forwarded-For': '38.253.189.198, 3.172.31.134',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    'Accept-Encoding': [ 'gzip, deflate' ],
    'CloudFront-Forwarded-Proto': [ 'https' ],
    'CloudFront-Is-Desktop-Viewer': [ 'true' ],
    'CloudFront-Is-Mobile-Viewer': [ 'false' ],
    'CloudFront-Is-SmartTV-Viewer': [ 'false' ],
    'CloudFront-Is-Tablet-Viewer': [ 'false' ],
    'CloudFront-Viewer-ASN': [ '265691' ],
    'CloudFront-Viewer-Country': [ 'PE' ],
    Host: [ '9fkjsjl0r5.execute-api.us-east-1.amazonaws.com' ],
    'User-Agent': [ 'vscode-restclient' ],
    Via: [
      '1.1 f2b25186ddd6c6eba84de9b968deb3f0.cloudfront.net (CloudFront)'
    ],
    'X-Amz-Cf-Id': [ 'IArGYJnnlw03YVNphDzGhlxerOi_WpyTgtMf7nlbJDKYG1rJnCKruw==' ],
    'X-Amzn-Trace-Id': [ 'Root=1-67d764cd-7c582a6d78c8d7251bc902ca' ],
    'x-api-key': [ '1oPS7zIZJQ9mvxMi19qjD9MsV2P6RxIP12ctiWgt' ],
    'X-Forwarded-For': [ '38.253.189.198, 3.172.31.134' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'jqfa37',
    resourcePath: '/api/v1/almacenar',
    httpMethod: 'POST',
    extendedRequestId: 'HiywIGtyIAMEWaQ=',
    requestTime: '16/Mar/2025:23:54:53 +0000',
    path: '/dev/api/v1/almacenar',
    accountId: '905418060440',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: '9fkjsjl0r5',
    requestTimeEpoch: 1742169293211,
    requestId: '1323f380-717c-4477-a88c-b6a5d4177343',
    identity: {
      cognitoIdentityPoolId: null,
      cognitoIdentityId: null,
      apiKey: '1oPS7zIZJQ9mvxMi19qjD9MsV2P6RxIP12ctiWgt',
      principalOrgId: null,
      cognitoAuthenticationType: null,
      userArn: null,
      apiKeyId: 'jpnj96d4bj',
      userAgent: 'vscode-restclient',
      accountId: null,
      caller: null,
      sourceIp: '38.253.189.198',
      accessKey: null,
      cognitoAuthenticationProvider: null,
      user: null
    },
    domainName: '9fkjsjl0r5.execute-api.us-east-1.amazonaws.com',
    deploymentId: '3ak31d',
    apiId: '9fkjsjl0r5'
  },
  body: '{\n    "description":"hello there",\n    "deadline":"assad"\n}',
  isBase64Encoded: false
},undefined,undefined)
