import { Module } from '@nestjs/common';
import { FusionadosContextModule } from '@swapi-monorepo/fusionados-context';
import { AppController } from './app.controller';


@Module({
  imports: [FusionadosContextModule],
  controllers: [AppController],
})
export class AppModule {}
