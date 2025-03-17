import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HttpCacheableClientService } from "@swapi-monorepo/shared";
import { ActionPackedCharacterEntity } from "../../../domain/entity/action-packed-character.entity";
import { SWAPIRepository } from "../../../domain/repository/swapi.repository";
import { PlanetVO } from "../../../domain/vo/planet.vo";
import { SWAPIGetPeople } from "./dto/people.dto";
import { PlanetDto } from "./dto/planet.dto";

@Injectable()
export class SWAPIClient implements SWAPIRepository {

    constructor(private httpService:HttpCacheableClientService){}

    async findPeopleByName(name: string): Promise<ActionPackedCharacterEntity> {
        const data = await this.httpService.request<SWAPIGetPeople>({
            method:'get',
            url:`${process.env["SWAPI_API_URL"]}/people?search=${name}`
        })
        if (!data.results.length) throw new NotFoundException("No se encontro personaje con ese nombre")
        if (data.results.length > 1)  throw new InternalServerErrorException("Hay mas de un personaje, debe ingresar un nombre mas especifico. Mas info SWAPI /people")
        const item = data.results[0]
        const planet = await this.getPlanet(item.homeworld)
        return new ActionPackedCharacterEntity(item.name,item.birth_year,item.eye_color,item.gender,item.hair_color,item.height,item.mass,item.skin_color,planet)
    }

    private async getPlanet(url:string):Promise<PlanetVO>{
        const data = await this.httpService.request<PlanetDto>({
            method:'get',
            url
        })
        return new PlanetVO(data.name,data.climate)
    }

}