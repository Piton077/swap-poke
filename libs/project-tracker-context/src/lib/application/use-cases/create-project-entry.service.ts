import { Inject, Injectable } from "@nestjs/common";
import { ProjectBacklogEntry } from "../../domain/entity/project-backlog-entry.entity";
import { ProjectBacklogRepository } from "../../domain/repository/project-backlog.repository";
import { ProjectBacklogDynamoDB } from "../../infrastructure/repository/dynamodb/project-backlog.repository";
import { CreateProjectEntryCommand } from "./commands/create-project-entry.command";

interface Response {
    id:string
    description:string
    createdAt:string
    status:string
    deadline:string
}

@Injectable()
export class CreateProjectEntryService {
    constructor( @Inject(ProjectBacklogDynamoDB) private repository:ProjectBacklogRepository){}

    async execute(entry:CreateProjectEntryCommand):Promise<Response>{
        const entity = new ProjectBacklogEntry(entry.deadline,entry.description);
        await this.repository.saveEntry(entity)
        return {
            id: entity.id,
            createdAt: entity.createdAt,
            deadline: entity.deadline,
            description: entity.description,
            status: entity.status
        }
    }
}