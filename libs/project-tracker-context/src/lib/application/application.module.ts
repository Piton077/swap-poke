import { Module } from "@nestjs/common";
import { ProjectEntryDynamoDBModule } from "../infrastructure/repository/dynamodb/project-entry.module";
import { CreateProjectEntryService } from "./use-cases/create-project-entry.service";

@Module({
    imports:[ProjectEntryDynamoDBModule],
    providers:[CreateProjectEntryService],
    exports:[CreateProjectEntryService]
})
export class ApplicationModule {}