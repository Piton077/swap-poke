import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { FetchCharacterUseCase } from "@swapi-monorepo/fusionados-context";


@Controller("fusionados")
export class AppController {
  constructor(private readonly useCase: FetchCharacterUseCase) {}

  @Get(":name")
  @HttpCode(201) 
  getData(@Param('name') name: string) {
    return this.useCase.execute(name)
  }
}
