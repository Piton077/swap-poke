import { Module } from '@nestjs/common';
import { FusionadosContextModule } from '@swapi-monorepo/fusionados-context';
import { DynamoDBConnectionModule } from '@swapi-monorepo/shared';
import { AppController } from './app.controller';

@Module({
  imports: [DynamoDBConnectionModule,FusionadosContextModule],
  controllers: [AppController],
})
export class AppModule {}
