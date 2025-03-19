import { Module } from '@nestjs/common';
import { ProjectTrackerContextModule } from "@swapi-monorepo/project-tracker-context";
import { DynamoDBConnectionModule } from '@swapi-monorepo/shared';
import { AppController } from './app.controller';


@Module({
  imports: [DynamoDBConnectionModule,ProjectTrackerContextModule],
  controllers: [AppController],
})
export class AppModule {}
