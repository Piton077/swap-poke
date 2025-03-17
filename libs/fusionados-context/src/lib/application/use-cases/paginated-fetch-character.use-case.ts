import { Inject, Injectable, Logger } from "@nestjs/common";
import { FusionadosRepository } from "../../domain/repository/fusionados.repository";
import { FusionadosDynamodbRepository } from "../../infrastructure/repository/dynamodb/fusionados-dynamodb.repository";
import { PaginatedFetchCommand } from "../commands/paginated-fetch.command";
import { EntityToResponseMapper } from "../shared/entity-to-response.mapper";



@Injectable()
export class PaginatedFetchCharacterUseCase {
  private logger:Logger = new Logger(PaginatedFetchCharacterUseCase.name)
  constructor(@Inject(FusionadosDynamodbRepository) private fusionadosRepository:FusionadosRepository){
  }
  async execute(command:PaginatedFetchCommand){
    this.logger.debug(`pagination info ${JSON.stringify(command)}`)
    const result = await this.fusionadosRepository.paginatedItems(command.limit,command.cursor)
    return {
        items: result.items.map(EntityToResponseMapper.characterEntityToResponse),
        cursor: result.cursor ?? null
    }
    
  }
}