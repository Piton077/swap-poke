import { ActionPackedCharacterEntity } from "../../domain/entity/action-packed-character.entity";

export interface Response {
    name: string
    birthYear: string
    eyeColor: string
    gender: string
    hairColor: string
    height: string
    mass: string
    skinColor: string
    createdAt: string
    pokemons: string[]
    planet: string
}

export class EntityToResponseMapper {
    static characterEntityToResponse(character: ActionPackedCharacterEntity): Response {
        return {
            birthYear: character.birthYear,
            createdAt: character.createdAt,
            eyeColor: character.eyeColor,
            gender: character.gender,
            hairColor: character.hairColor,
            height: character.height,
            mass: character.mass,
            name: character.name,
            planet: character.planet.name,
            pokemons: character.pokemons,
            skinColor: character.skinColor
        }
    }
}