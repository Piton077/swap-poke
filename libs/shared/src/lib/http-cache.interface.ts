import { RequestModel } from "./dto/request.model"

export interface HttpCache {
    saveRequest(method:string,endpoint:string,response:any):Promise<string>
    getRequest(method:string,endpoint:string):Promise<RequestModel | undefined>

}