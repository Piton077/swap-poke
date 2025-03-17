import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ActionPackedCharacterEntity } from "../../../domain/entity/action-packed-character.entity";
import { FusionadosRepository } from "../../../domain/repository/fusionados.repository";
import { FusionadoModel } from "./fusionado.model";

@Injectable()
export class FusionadosDynamodbRepository implements FusionadosRepository {

    private logger:Logger
    constructor( @Inject('DynamoDBConnection') private client: DynamoDBDocumentClient){
        this.logger = new Logger(FusionadosDynamodbRepository.name)
    }

    async saveItem(entity: ActionPackedCharacterEntity): Promise<void> {
        const model = new FusionadoModel(
            entity.name,
            entity.birthYear,
            entity.eyeColor,
            entity.gender,
            entity.hairColor,
            entity.createdAt,
            entity.skinColor,
            entity.pokemons,
            entity.planet.name
        )
       const getParams: PutCommandInput = {
        TableName: process.env["CHARACTER_TABLE"],
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