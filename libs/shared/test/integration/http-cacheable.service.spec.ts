
import { DynamoDBDocumentClient, GetCommandOutput, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { RequestModel } from "@lib/dto/request.model";
import { DynamoDBConnectionModule } from "@lib/dynamodb.module";
import { HttpCacheDynamodb } from "@lib/http-cache-dynamodb";
import { HttpCacheableClientService } from "@lib/http-cacheable.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from "axios";
import { of } from "rxjs";


jest.mock("@nestjs/common", () => {
    const actualLib = jest.requireActual("@nestjs/common")
    class MockLogger {
        error = jest.fn();
        log = jest.fn();
        debug = jest.fn();
        static overrideLogger = jest.fn()
    }
    return {
        ...actualLib,
        Logger: MockLogger
    }
})


describe('Integration test for http cacheable service', () => {
    let httpService: HttpService
    let dynamodb: DynamoDBDocumentClient
    let httpCache: HttpCacheDynamodb
    let httpCacheablService: HttpCacheableClientService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DynamoDBConnectionModule, HttpModule],
            providers: [
                HttpCacheDynamodb,
                HttpCacheableClientService
            ]
        })
            .overrideProvider(HttpService)
            .useValue({
                request: jest.fn()
            })
            .overrideProvider('DynamoDBConnection')
            .useValue({
                send: jest.fn()
            })
            .compile();
        httpCacheablService = module.get<HttpCacheableClientService>(HttpCacheableClientService)
        httpCache = module.get<HttpCacheDynamodb>(HttpCacheDynamodb)
        httpService = module.get<HttpService>(HttpService)
        dynamodb = module.get<DynamoDBDocumentClient>('DynamoDBConnection')
    });
    it('if the request is in cache', async () => {
        const expected = {
            request: {
                method: 'get',
                url: "https://testing123/123"
            },
            result: {
                nombre: "test1",
                description: "description1"
            }
        }
        const entry: RequestModel = {
            "endpoint": expected.request.url, "method": expected.request.method, "request": `request:${expected.request.method}:${expected.request.url}`, "response": expected.result, "timestamp": 1742212800000, "ttl": 1742214600
        }
        const output: GetCommandOutput = {
            $metadata: {},
            Item: entry
        }
        jest.spyOn(dynamodb, 'send').mockImplementationOnce(() => Promise.resolve(output))

        const result = await httpCacheablService.request<{ nombre: string, description: string }>(expected.request)
        expect(result).toEqual(expected.result)
    })

    it('if the request is not in cache return model from endpoint and save in Cache', async () => {
        const expected = {
            request: {
                method: 'get',
                url: "https://testing123/123"
            },
            result: {
                nombre: "test1",
                description: "description1"
            }
        }
        const response: AxiosResponse<any> = {
            data: expected.result,
            status: 200,
            statusText: "200",
            headers: {},
            config: {} as unknown as any
        }
        jest.spyOn(httpService, 'request').mockReturnValueOnce(of(response))
        const output: GetCommandOutput = {
            $metadata: {}
        }
        jest.spyOn(dynamodb, "send").mockImplementationOnce(() => Promise.resolve(output))
        process.env["EXPIRY_TIME"] = "1800" // in seconds
        process.env["CACHE_TABLE"] = "cache-table"
        const expectedModel = { "endpoint": expected.request.url, "method": expected.request.method, "request": `request:${expected.request.method}:${expected.request.url}`, "response": expected.result, "timestamp": 1742212800000, "ttl": 1742214600 }
        const expectedCommand: PutCommandInput = {
            TableName: 'cache-table',
            Item: expectedModel
        };
        const mockDate = new Date('2025-03-17T12:00:00Z');
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);
        const spy = jest.spyOn(dynamodb, "send")
        const result = await httpCacheablService.request<{ nombre: string, description: string }>(expected.request)
        expect(result).toEqual(expected.result)
        expect(spy.mock.calls[1][0].input).toEqual(expectedCommand)
    })


    afterAll(() => {
        jest.clearAllMocks()
    })
})