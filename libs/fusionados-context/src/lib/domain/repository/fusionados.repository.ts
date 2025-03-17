import { ActionPackedCharacterEntity } from "../entity/action-packed-character.entity";

export interface FusionadosRepository {
    saveItem(entity:ActionPackedCharacterEntity):Promise<void>
    paginatedItems(limit:number,cursor?:string):Promise<{
        items:ActionPackedCharacterEntity[],
        cursor?:string
    }>
}