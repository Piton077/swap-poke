import { ActionPackedCharacterEntity } from "../entity/action-packed-character.entity";

export interface FusionadosRepository {
    saveItem(entity:ActionPackedCharacterEntity):Promise<void>
}