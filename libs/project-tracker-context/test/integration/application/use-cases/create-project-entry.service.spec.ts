import { ApplicationModule } from "@application/application.module";
import { CreateProjectEntryCommand } from "@application/use-cases/commands/create-project-entry.command";
import { CreateProjectEntryService } from "@application/use-cases/create-project-entry.service";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Test, TestingModule } from '@nestjs/testing';
import { nanoid } from "nanoid";

jest.mock('nanoid')


describe('Integration test for create project entry service', () => {
  let documentClient: DynamoDBDocumentClient;
  let useCase: CreateProjectEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ApplicationModule]
    })
    .overrideProvider('DynamoDBConnection')
    .useValue({
        send:jest.fn()
    })
    .compile();

    documentClient = module.get<DynamoDBDocumentClient>("DynamoDBConnection");
    useCase = module.get<CreateProjectEntryService>(CreateProjectEntryService)
  });

  it('should return the new entry along with data, when a new entry request comes in', async () => {
    const fakeId:string = "id";
    (nanoid as jest.Mock).mockReturnValueOnce("id");
    const mockDate = new Date('2025-03-17T12:00:00Z');
    jest.spyOn(global,'Date').mockImplementation(() => mockDate as any);
    const expected = {"createdAt": "2025-03-17T12:00:00.000Z", "deadline": "deadline", "description": "description", "id": fakeId, "status": "to_do"}
    const command = new CreateProjectEntryCommand("description","deadline")
    const result = await useCase.execute(command)
    expect(result).toEqual(expected);
  });
  afterAll(()=>{
    jest.clearAllMocks()
})
});
