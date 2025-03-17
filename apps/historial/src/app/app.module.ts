import { Module } from '@nestjs/common';
import { FusionadosContextModule } from '@swapi-monorepo/fusionados-context';
import { DynamoDBConnectionModule, EnhancedHttpModule } from '@swapi-monorepo/shared';
import { AppController } from './app.controller';


@Module({
  imports: [FusionadosContextModule,EnhancedHttpModule,DynamoDBConnectionModule],
  controllers: [AppController],
})
export class AppModule {}
