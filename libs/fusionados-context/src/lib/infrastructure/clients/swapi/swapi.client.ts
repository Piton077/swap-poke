import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { ActionPackedCharacterEntity } from "../../../domain/entity/action-packed-character.entity";
import { SWAPIRepository } from "../../../domain/repository/swapi.repository";
import { PlanetVO } from "../../../domain/vo/planet.vo";
import { SWAPIGetPeople } from "./dto/people.dto";
import { PlanetDto } from "./dto/planet.dto";

@Injectable()
export class SWAPIClient implements SWAPIRepository {

    constructor(private httpService:HttpService){}

    async findPeopleByName(name: string): Promise<ActionPackedCharacterEntity> {
        const { data } = await firstValueFrom<AxiosResponse<SWAPIGetPeople>>(
            this.httpService.get(`${process.env["SWAPI_API_URL"]}/people`,{
                params:{
                    search:name
                }
            }),
        );
        if (!data.results.length) throw new NotFoundException("No se encontro personaje con ese nombre")
        if (data.results.length > 1)  throw new InternalServerErrorException("Hay mas de un personaje, debe ingresar un nombre mas especifico. Mas info SWAPI /people")
        const item = data.results[0]
        const planet = await this.getPlanet(item.homeworld)
        return new ActionPackedCharacterEntity(item.name,item.birth_year,item.eye_color,item.gender,item.hair_color,item.height,item.mass,item.skin_color,planet)
    }

    private async getPlanet(url:string):Promise<PlanetVO>{
        const { data } = await firstValueFrom<AxiosResponse<PlanetDto>>(
            this.httpService.get(url),
        );
        return new PlanetVO(data.name,data.climate)
    }

    

}