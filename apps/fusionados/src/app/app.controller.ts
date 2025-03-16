import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("fusionados")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(":name")
  getData() {
    return this.appService.getData();
  }
}
