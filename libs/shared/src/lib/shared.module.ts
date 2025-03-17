import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpCacheDynamodb } from './http-cache-dynamodb';
import { HttpCacheableClientService } from './http-cacheable.service';

@Module({
  imports:[HttpModule],
  providers: [
    HttpCacheDynamodb,
    HttpCacheableClientService
  ],
  exports: [HttpCacheableClientService],
})
export class SharedModule {}
