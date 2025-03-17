import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { PokemonRepository } from "../../../domain/repository/pokemon.repository";
import { PokemonVO } from "../../../domain/vo/pokemon.vo";
import { PokemonTypeDto } from "./dto/pokemon-type.dto";

@Injectable()
export class PokemonClient implements PokemonRepository {

    constructor(private httpService:HttpService){}
    async findByType(type: string): Promise<PokemonVO[]> {
        const { data } = await firstValueFrom<AxiosResponse<PokemonTypeDto>>(
            this.httpService.get(`${process.env["POKEMON_API_URL"]}/type/${type}`),
        );
        const pokemons = (data.pokemon.length > +process.env["POKEMON_UPPER_LIMIT"]!) ? data.pokemon.slice(0,+process.env["POKEMON_UPPER_LIMIT"]!) :data.pokemon
        
        return pokemons.map(p=> new PokemonVO(p.pokemon.name))
    }

   
    

}