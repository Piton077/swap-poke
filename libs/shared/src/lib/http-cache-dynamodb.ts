import { DynamoDBDocumentClient, GetCommand, GetCommandInput, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { RequestModel } from "./dto/request.model";
import { HttpCache } from "./http-cache.interface";


@Injectable()
export class HttpCacheDynamodb implements HttpCache {

    private logger:Logger
    constructor( @Inject('DynamoDBConnection') private client: DynamoDBDocumentClient){
        this.logger = new Logger(HttpCacheDynamodb.name)
    }

    async getRequest(method: string, endpoint: string): Promise<RequestModel | undefined> {
        const key = `request:${method}:${endpoint}`
        const dbParams: GetCommandInput = {
            TableName: process.env["CACHE_TABLE"],
            Key:{
                request:key
            }
          };
          const command = new GetCommand(dbParams);
          const result = await this.client.send(command);
          if (!result.Item) return undefined
          return result?.Item as RequestModel
    }
    
    async saveRequest(method: string, endpoint: string,response: any): Promise<string> {
       const model:RequestModel = {
        endpoint,
        method,
        timestamp: +new Date(),
        ttl:Math.floor(+new Date() / 1000) + (+process.env["EXPIRY_TIME"]!),
        request:`request:${method}:${endpoint}`,
        response
       }
       const getParams: PutCommandInput = {
        TableName: process.env["CACHE_TABLE"],
        Item: model
      };
      try {
        this.logger.debug(`Arranging item to save ${model}`)
        await this.client.send(new PutCommand(getParams));
        return model.request
      } catch (error) {
        this.logger.error('Error while saving project backlog entry item',error)
        throw error
      }
    }
   

   


}