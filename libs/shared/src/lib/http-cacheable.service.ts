import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { firstValueFrom } from "rxjs";
import { HttpCacheDynamodb } from "./http-cache-dynamodb";
import { HttpCache } from "./http-cache.interface";

@Injectable()
export class HttpCacheableClientService {
  private logger:Logger;
  constructor(private readonly httpService: HttpService, @Inject(HttpCacheDynamodb) private httpCache:HttpCache ) {
    this.logger= new Logger(HttpCacheableClientService.name)
  }

  async request<T>(config:AxiosRequestConfig): Promise<T> {
    this.logger.log(`Fetching: ${config.method}/${config.url}`);
    const result = await this.httpCache.getRequest(config.method!,config.url!)
    if (result) {
        this.logger.log(`Retrieved from cache: ${config.method}/${config.url}`);
        return result.response
    }
    const {data} = await firstValueFrom(this.httpService.request<T>(config));
    const cacheEntryKey = await this.httpCache.saveRequest(config.method!,config.url!,data)
    this.logger.log(`Saved in cache with ${cacheEntryKey}`)
    return data;
  }
}
