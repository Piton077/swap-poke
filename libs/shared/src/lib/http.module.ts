import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import * as AWSXRay from 'aws-xray-sdk';

@Global()
@Module({
    imports:[HttpModule],
    exports:[HttpModule]
})
export class EnhancedHttpModule {
    onModuleInit() {
        AWSXRay.captureHTTPsGlobal(require('https')); 
        AWSXRay.captureHTTPsGlobal(require('http'));  
      }
}