import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FusionadosContextModule } from '@swapi-monorepo/fusionados-context';

@Module({
  imports: [FusionadosContextModule],
  controllers: [AppController],
})
export class AppModule {}
