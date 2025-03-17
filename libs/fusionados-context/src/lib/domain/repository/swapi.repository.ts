import { ActionPackedCharacterEntity } from "../entity/action-packed-character.entity";

export interface SWAPIRepository {
    findPeopleByName(name:string):Promise<ActionPackedCharacterEntity>
}