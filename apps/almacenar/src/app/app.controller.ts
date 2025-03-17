import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectEntryCommand, CreateProjectEntryService } from "@swapi-monorepo/project-tracker-context";
import { CreateSpeciesInputDto } from './dto/create-entry.dto';


@Controller("almacenar")
export class AppController {
  constructor(private readonly service: CreateProjectEntryService) {}

  @Post("/")
  getData( @Body() body: CreateSpeciesInputDto) {
    return this.service.execute(new CreateProjectEntryCommand(body.description,body.deadline))
  }
}
