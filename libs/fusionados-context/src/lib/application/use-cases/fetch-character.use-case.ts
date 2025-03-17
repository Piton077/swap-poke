import { Inject, Injectable, Logger } from "@nestjs/common";
import { FusionadosRepository } from "../../domain/repository/fusionados.repository";
import { PokemonRepository } from "../../domain/repository/pokemon.repository";
import { SWAPIRepository } from "../../domain/repository/swapi.repository";
import { EvaluateSuitablePokemonService } from "../../domain/services/evaluate-suitable-pokemon";
import { PokemonClient } from "../../infrastructure/clients/pokemon/pokemon.client";
import { SWAPIClient } from "../../infrastructure/clients/swapi/swapi.client";
import { FusionadosDynamodbRepository } from "../../infrastructure/repository/dynamodb/fusionados-dynamodb.repository";

interface Response  {
  name:string
  birthYear:string
  eyeColor:string
  gender:string
  hairColor:string
  height:string
  mass:string
  skinColor:string
  createdAt:string
  pokemons:string[]
  planet:string
}

@Injectable()
export class FetchCharacterUseCase {
  private readonly evaluateSuitablePokemonService:EvaluateSuitablePokemonService;
  private logger:Logger = new Logger(FetchCharacterUseCase.name)
  constructor(@Inject(SWAPIClient) private swapiRepository:SWAPIRepository, @Inject(PokemonClient) private pokemonRepository:PokemonRepository, @Inject(FusionadosDynamodbRepository) private fusionadosRepository:FusionadosRepository){
    this.evaluateSuitablePokemonService =  new EvaluateSuitablePokemonService()
  }
  async execute(name:string):Promise<Response>{
    const character = await this.swapiRepository.findPeopleByName(name)
    const pokemonTypes = this.evaluateSuitablePokemonService.getSuitablePokemonType(character.planet)
    const pokemons = await Promise
    .allSettled(pokemonTypes.map(type=>this.pokemonRepository.findByType(type)))
    .then((results)=>{
      const successes = results.filter(p => p.status === "fulfilled").map(p => p.value);
      const failures = results.filter(p => p.status === "rejected").map(p => p.reason);
      this.logger.warn(failures)
      return successes.flat()
    })
    character.setPokemons(pokemons)
    await this.fusionadosRepository.saveItem(character)
    return {
      birthYear:character.birthYear,
      createdAt:character.createdAt,
      eyeColor:character.eyeColor,
      gender:character.gender,
      hairColor:character.hairColor,
      height:character.height,
      mass:character.mass,
      name:character.name,
      planet:character.planet.name,
      pokemons:character.pokemons,
      skinColor:character.skinColor
    }
    
  }
}