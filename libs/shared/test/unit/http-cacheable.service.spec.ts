
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


describe('Unit test for http cacheable service', () => {
    let httpService: HttpService
    let httpCache: HttpCacheDynamodb
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DynamoDBConnectionModule, HttpModule],
            providers: [HttpCacheDynamodb,
                HttpCacheableClientService]
        })
            .overrideProvider(HttpService)
            .useValue({
                request: jest.fn()
            })
            .overrideProvider(HttpCacheDynamodb)
            .useValue({
                getRequest: jest.fn(),
                saveRequest:jest.fn()
            })
            .compile();

        httpService = module.get<HttpService>(HttpService)
        httpCache = module.get<HttpCacheDynamodb>(HttpCacheDynamodb)
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
        const httpCacheableService = new HttpCacheableClientService(
            httpService,
            httpCache
        )
        jest.spyOn(httpCache, 'getRequest').mockResolvedValueOnce({
            endpoint: expected.request.url,
            method: expected.request.method,
            request: `request:${expected.request.method}:${expected.result}`,
            response: expected.result,
            timestamp: 999999,
            ttl: 99999,
        })
        const result = await httpCacheableService.request<{ nombre: string, description: string }>(expected.request)
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
        const httpCacheableService = new HttpCacheableClientService(
            httpService,
            httpCache
        )
        const response:AxiosResponse<any> = {
            data: expected.result,
            status:200,
            statusText:"200",
            headers:{},
            config:{} as unknown as any
        }
        jest.spyOn(httpService, 'request').mockReturnValueOnce(of(response))
        const spy = jest.spyOn(httpCache,"saveRequest")
        const result = await httpCacheableService.request<{ nombre: string, description: string }>(expected.request)
        expect(result).toEqual(expected.result)
        expect(spy.mock.calls[0]).toEqual([expected.request.method,expected.request.url, expected.result])
    })


    afterAll(() => {
        jest.clearAllMocks()
    })
})