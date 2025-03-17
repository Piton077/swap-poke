import { Module } from '@nestjs/common';
import { ClientsModule } from '../infrastructure/clients/clients.module';
import { FusionadosDynamodbModule } from '../infrastructure/repository/dynamodb/fusionados-dynamodb.module';
import { FetchCharacterUseCase } from './use-cases/fetch-character.use-case';

@Module({
  imports: [ClientsModule,FusionadosDynamodbModule],
  providers: [FetchCharacterUseCase],
  exports: [FetchCharacterUseCase]
})
export class ApplicationModule {}
