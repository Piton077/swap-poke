import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("almacenar")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/")
  getData() {
    return this.appService.getData();
  }
}
