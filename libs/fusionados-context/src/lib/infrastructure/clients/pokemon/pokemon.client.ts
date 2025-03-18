import { Injectable } from "@nestjs/common";
import { HttpCacheableClientService } from "@swapi-monorepo/shared";
import { PokemonRepository } from "../../../domain/repository/pokemon.repository";
import { PokemonVO } from "../../../domain/vo/pokemon.vo";
import { PokemonTypeDto } from "./dto/pokemon-type.dto";

@Injectable()
export class PokemonClient implements PokemonRepository {

    constructor(private httpService:HttpCacheableClientService){}
    async findByType(type: string): Promise<PokemonVO[]> {
        const data = await this.httpService.request<PokemonTypeDto>({
            method:'get',
            url:`${process.env["POKEMON_API_URL"]}/type/${type}`
        })        
        return data.pokemon.map(p=> new PokemonVO(p.pokemon.name))
    }

   
    

}