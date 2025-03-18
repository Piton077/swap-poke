
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommandOutput, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { RequestModel } from "@lib/dto/request.model";
import { HttpCacheDynamodb } from "@lib/http-cache-dynamodb";

jest.mock("@nestjs/common", () => {
    const actualLib = jest.requireActual("@nestjs/common")
    return {
        ...actualLib,
        Logger: jest.fn().mockImplementation(() => ({
            error: jest.fn(),
            log: jest.fn(),
            debug: jest.fn()
        }))
    }
})
jest.mock("@aws-sdk/client-dynamodb")

jest.mock("@aws-sdk/lib-dynamodb", () => {
    const actualLib = jest.requireActual("@aws-sdk/lib-dynamodb"); 
    return {
        ...actualLib,
      DynamoDBDocumentClient: {
        from: jest.fn().mockImplementation((client) => ({
          send: jest.fn(),
          _client: client,
        })),
      },
    };
  });

describe('Unit test for http cache dynamodb', () => {
    let mockDocClient:jest.Mocked<DynamoDBDocumentClient>;
    beforeEach(()=>{
        const mockDynamoClient = new DynamoDBClient() as jest.Mocked<DynamoDBClient>;
        mockDocClient = DynamoDBDocumentClient.from(mockDynamoClient) as jest.Mocked<DynamoDBDocumentClient>;
    })
    it('save a request in dynamodb', async () => {
        const request = {
            method: "get",
            endpoint: "https://test-id/test12",
            response: {
                data: "test12",
                createdAt: "today"
            }
        }
        process.env["EXPIRY_TIME"] = "1800" // in seconds
        process.env["CACHE_TABLE"] = "cache-table"
        const expectedModel = { "endpoint": request.endpoint, "method": request.method, "request": `request:${request.method}:${request.endpoint}`, "response": request.response, "timestamp": 1742212800000, "ttl": 1742214600 }
        const expected: PutCommandInput = {
            TableName: 'cache-table',
            Item: expectedModel
        };
        const mockDate = new Date('2025-03-17T12:00:00Z');
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        const httpCacheService = new HttpCacheDynamodb(mockDocClient)
        await httpCacheService.saveRequest(request.method, request.endpoint, request.response)
        expect(mockDocClient.send.mock.calls[0][0].input).toEqual(expected)
    })
    it('if the request is cached, return model',async()=>{
        const requestToRetrieve = {
            method:"get",
            endpoint:"https://test.com/test12"
        }
        const entry:RequestModel = { "endpoint": requestToRetrieve.endpoint, "method": requestToRetrieve.method, "request": `request:${requestToRetrieve.method}:${requestToRetrieve.endpoint}`, "response": {
            data: "test12",
            createdAt: "today"
        }, "timestamp": 1742212800000, "ttl": 1742214600 }
        const output:GetCommandOutput = {
            $metadata:{},
            Item:entry
        }
        jest.spyOn(mockDocClient,'send').mockImplementationOnce(()=>Promise.resolve(output))
        const httpCacheService = new HttpCacheDynamodb(mockDocClient)
        const result = await httpCacheService.getRequest(requestToRetrieve.method,requestToRetrieve.endpoint)
        expect(result).toBe(result)
    })
    it('if the request is not cached, return undefined',async()=>{
        const requestToRetrieve = {
            method:"get",
            endpoint:"https://test.com/test12"
        }
        const httpCacheService = new HttpCacheDynamodb(mockDocClient)
        const output:GetCommandOutput = {
            $metadata:{}
        }
        jest.spyOn(mockDocClient,'send').mockImplementationOnce(()=>Promise.resolve(output))
        const result = await httpCacheService.getRequest(requestToRetrieve.method,requestToRetrieve.endpoint)
        expect(result).toBeUndefined()
    })
    afterAll(() => {
        jest.clearAllMocks()
    })
})