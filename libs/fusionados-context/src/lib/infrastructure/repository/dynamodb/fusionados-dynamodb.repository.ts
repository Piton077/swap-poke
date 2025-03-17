import { DynamoDBDocumentClient, PutCommand, PutCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ActionPackedCharacterEntity } from "../../../domain/entity/action-packed-character.entity";
import { FusionadosRepository } from "../../../domain/repository/fusionados.repository";
import { PokemonVO } from "../../../domain/vo/pokemon.vo";
import { FusionadoModel } from "./fusionado.model";

@Injectable()
export class FusionadosDynamodbRepository implements FusionadosRepository {

  private logger: Logger
  constructor(@Inject('DynamoDBConnection') private client: DynamoDBDocumentClient) {
    this.logger = new Logger(FusionadosDynamodbRepository.name)
  }
  async paginatedItems(limit: number, cursor?: string): Promise<{ items: ActionPackedCharacterEntity[]; cursor?: string; }> {
    const getParams: ScanCommandInput = {
      TableName: process.env["CHARACTER_TABLE"],
      Limit:limit
    };
    if (cursor) {
      getParams.ExclusiveStartKey = {
        name: cursor
      };
    }
    const result = await this.client.send(new ScanCommand(getParams));
    const items = result.Items as FusionadoModel[]
    items.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() )
    return {
      items:items.map(x=> new ActionPackedCharacterEntity(
        x.name,
        x.birthYear,
        x.eyeColor,
        x.gender,
        x.hairColor,
        x.height,
        x.mass,
        x.skinColor,
        x.planet,
        x.createdAt,
        x.pokemons.map(p=>new PokemonVO(p))
      )), 
      cursor: result.LastEvaluatedKey?.["name"]
    }
  }




  async saveItem(entity: ActionPackedCharacterEntity): Promise<void> {
    const model = new FusionadoModel(
      entity.name,
      entity.birthYear,
      entity.eyeColor,
      entity.gender,
      entity.hairColor,
      entity.height,
      entity.mass,
      entity.createdAt,
      entity.skinColor,
      entity.pokemons,
      {name:entity.planet.name,climate:entity.planet.climate}
    )
    const getParams: PutCommandInput = {
      TableName: process.env["CHARACTER_TABLE"],
      Item: model
    };
    try {
      this.logger.debug(`Arranging item to save ${model}`)
      await this.client.send(new PutCommand(getParams));
    } catch (error) {
      this.logger.error('Error while saving project backlog entry item', error)
      throw error
    }
  }

}