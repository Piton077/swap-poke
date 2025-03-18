
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { ProjectBacklogEntry } from "@domain/entity/project-backlog-entry.entity";
import { ProjectBacklogDynamoDB } from "@infrastructure/repository/dynamodb/project-backlog.repository";
import { ProjectEntryModel } from "@infrastructure/repository/dynamodb/project-entry.model";
import { nanoid } from "nanoid";

jest.mock("@aws-sdk/client-dynamodb");

jest.mock("@aws-sdk/lib-dynamodb", () => {
    const actualLib = jest.requireActual("@aws-sdk/lib-dynamodb"); 
    return {
        ...actualLib,
      DynamoDBDocumentClient: {
        from: jest.fn().mockImplementation((client) => ({
          send: jest.fn(), // Mock send method
          _client: client, // Keep reference for debugging
        })),
      },
    };
  });
  
describe('Unit test for project backlog repository',()=>{
    it('create new entry in database',async ()=>{
        const mockDynamoClient = new DynamoDBClient({}) as jest.Mocked<DynamoDBClient>;
        const mockDocClient = DynamoDBDocumentClient.from(mockDynamoClient) as jest.Mocked<DynamoDBDocumentClient>;
        
        const expectedDate = new Date().toISOString()
        const id = nanoid()
        const entry = new ProjectBacklogEntry("1972-02-13","description","to_do",expectedDate,id)
        const model = new ProjectEntryModel(entry.id,entry.description,entry.deadline,entry.createdAt,entry.status)
            
        const getParams: PutCommandInput = {
                TableName: process.env["PROJECT_TRACKER_TABLE"],
                Item: model
        };
        const expected =  new PutCommand(getParams)
        const projectBacklogRepository = new ProjectBacklogDynamoDB(mockDocClient)
        await projectBacklogRepository.saveEntry(
            entry
        )
        expect(mockDocClient.send.mock.calls[0][0].input).toEqual(expected.input)
    })
})