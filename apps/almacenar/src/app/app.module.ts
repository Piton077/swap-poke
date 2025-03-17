import { Module } from '@nestjs/common';
import { ProjectTrackerContextModule } from "@swapi-monorepo/project-tracker-context";
import { AppController } from './app.controller';

@Module({
  imports: [ProjectTrackerContextModule],
  controllers: [AppController],
})
export class AppModule {}
