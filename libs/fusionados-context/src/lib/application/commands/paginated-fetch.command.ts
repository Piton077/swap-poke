export class PaginatedFetchCommand {
    constructor(public limit:number, public cursor?:string){}
}