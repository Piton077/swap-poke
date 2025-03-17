import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PaginationDto } from './dto/pagination-dto';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData(new PaginationDto())).toEqual({ message: 'Hello API' });
    });
  });
});
