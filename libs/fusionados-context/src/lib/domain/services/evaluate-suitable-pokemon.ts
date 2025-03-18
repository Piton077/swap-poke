import { PlanetVO } from "../vo/planet.vo";

const pairingPokemonTypePlanetDictionary:{[key:string]:string[]} = {
    "arid": ["ground", "fire", "rock"],
    "temperate": ["normal", "grass", "bug"],
    "tropical": ["grass", "bug", "water", "flying"],
    "frozen": ["ice", "water"],
    "murky": ["poison", "dark", "ghost"],
    "windy": ["flying", "electric"],
    "hot": ["fire", "ground"],
    "artificial temperate": ["steel", "electric", "normal"],
    "frigid": ["ice", "dragon"],
    "humid": ["water", "grass"],
    "moist": ["water", "bug", "poison"],
    "polluted": ["poison", "dark", "steel"],
    "unknown": ["unknown", "psychic"],
    "superheated": ["fire", "dragon", "steel"],
    "subarctic": ["ice", "dark", "water"],
    "arctic": ["ice", "water"],
    "rocky": ["rock", "ground"]
  }
  

export class EvaluateSuitablePokemonService {
    getSuitablePokemonType(planet: PlanetVO){
        const pokemonType = pairingPokemonTypePlanetDictionary[planet.climate] 
        return pokemonType ?? []
    }
}