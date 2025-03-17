import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Module } from "@nestjs/common";
import { ProjectBacklogDynamoDB } from "./project-backlog.repository";

@Module({
    providers:[
        ProjectBacklogDynamoDB,
        {
            provide:'DynamoDBConnection',
            useFactory: ()=>{
                return DynamoDBDocumentClient.from(new DynamoDBClient())
            }
        },
    ],
    exports:[ProjectBacklogDynamoDB]
})
export class ProjectEntryDynamoDBModule {

}