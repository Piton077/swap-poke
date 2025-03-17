import { PokemonVO } from "../vo/pokemon.vo";

export interface PokemonRepository {
    findByType(type:string):Promise<PokemonVO[]>
}