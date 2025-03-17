import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedFetchCharacterUseCase } from '@swapi-monorepo/fusionados-context';
import { PaginatedFetchCommand } from 'libs/fusionados-context/src/lib/application/commands/paginated-fetch.command';
import { PaginationDto } from './dto/pagination-dto';

@Controller("fusionados")
export class AppController {
  constructor(private readonly useCase:PaginatedFetchCharacterUseCase) {}

  @Get("/historial")
  getData(@Query() paginationDto: PaginationDto) {
    return this.useCase.execute(new PaginatedFetchCommand(+paginationDto.limit,paginationDto.cursor));
  }
}
