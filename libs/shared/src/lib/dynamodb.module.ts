import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    providers:[
        {
              provide:'DynamoDBConnection',
              useFactory: ()=>{
                  return DynamoDBDocumentClient.from(new DynamoDBClient())
              }
          }
    ],
    exports:["DynamoDBConnection"]
})
export class DynamoDBConnectionModule {

}