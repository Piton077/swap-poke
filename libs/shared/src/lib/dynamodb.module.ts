import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Global, Module } from "@nestjs/common";
import * as AWSXRay from 'aws-xray-sdk';

@Global()
@Module({
    providers:[
        {
              provide:'DynamoDBConnection',
              useFactory: ()=>{
                  return DynamoDBDocumentClient.from(AWSXRay.captureAWSv3Client(new DynamoDBClient()))
              }
          }
    ],
    exports:["DynamoDBConnection"]
})
export class DynamoDBConnectionModule {

}