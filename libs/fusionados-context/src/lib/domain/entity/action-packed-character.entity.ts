import { PlanetVO } from "../vo/planet.vo"
import { PokemonVO } from "../vo/pokemon.vo"

export class ActionPackedCharacterEntity {

    constructor(
        private _name: string,
        private _birthYear: string,
        private _eyeColor: string,
        private _gender: string,
        private _hairColor: string,
        private _height: string,
        private _mass: string,
        private _skinColor: string,
        private _planet:PlanetVO,
        private _createdAt: string = new Date().toISOString(),
        private _pokemons: PokemonVO[] = [],
    ) { }

    get name() { return this._name }
    get birthYear() { return this._birthYear }
    get eyeColor() { return this._eyeColor }
    get gender() { return this._gender }
    get hairColor() { return this._hairColor }
    get height() { return this._height }
    get mass() { return this._mass }
    get skinColor() { return this._skinColor }
    get createdAt() { return this._createdAt }
    get pokemons() { return this._pokemons.map(x=>x.name) }
    get planet() {return this._planet}

    setPokemons(pokemons: PokemonVO[]) {
        this._pokemons = pokemons
    }

    get homeworldName(){
        return this._planet.name
    }



}