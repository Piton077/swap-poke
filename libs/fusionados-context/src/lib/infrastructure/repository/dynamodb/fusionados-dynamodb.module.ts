import { Module } from "@nestjs/common";
import { FusionadosDynamodbRepository } from "./fusionados-dynamodb.repository";

@Module({
    providers:[
        FusionadosDynamodbRepository,
    ],
    exports:[FusionadosDynamodbRepository]
})
export class FusionadosDynamodbModule {

}