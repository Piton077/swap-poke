import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Module } from "@nestjs/common";
import { FusionadosDynamodbRepository } from "./fusionados-dynamodb.repository";

@Module({
    providers:[
        FusionadosDynamodbRepository,
        {
            provide:'DynamoDBConnection',
            useFactory: ()=>{
                return DynamoDBDocumentClient.from(new DynamoDBClient())
            }
        },
    ],
    exports:[FusionadosDynamodbRepository]
})
export class FusionadosDynamodbModule {

}