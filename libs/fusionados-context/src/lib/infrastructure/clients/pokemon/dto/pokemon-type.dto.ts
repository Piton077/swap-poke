export interface PokemonInfo {
    name:string
}

export interface PokemonTypeDto {
    pokemon: {pokemon:PokemonInfo,slot:number}[]
}