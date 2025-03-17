import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ProjectBacklogEntry } from "../../../domain/entity/project-backlog-entry.entity";
import { ProjectBacklogRepository } from "../../../domain/repository/project-backlog.repository";
import { ProjectEntryModel } from "./project-entry.model";

@Injectable()
export class ProjectBacklogDynamoDB implements ProjectBacklogRepository{
    private logger:Logger
    constructor( @Inject('DynamoDBConnection') private client: DynamoDBDocumentClient){
        this.logger = new Logger(ProjectBacklogDynamoDB.name)
    }
    
    async saveEntry(entry: ProjectBacklogEntry): Promise<void> {
       const model = new ProjectEntryModel(entry.id,entry.description,entry.deadline,entry.createdAt,entry.status)
       const getParams: PutCommandInput = {
        TableName: process.env["PROJECT_TRACKER_TABLE"],
        Item: model
      };
      try {
        this.logger.debug(`Arranging item to save ${model}`)
        await this.client.send(new PutCommand(getParams));
      } catch (error) {
        this.logger.error('Error while saving project backlog entry item',error)
        throw error
      }
    }

 
}