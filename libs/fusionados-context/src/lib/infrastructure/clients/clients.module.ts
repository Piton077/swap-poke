import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PokemonClient } from "./pokemon/pokemon.client";
import { SWAPIClient } from "./swapi/swapi.client";

@Module({
    imports:[HttpModule],
    providers:[
        SWAPIClient,
        PokemonClient
    ],
    exports:[SWAPIClient,PokemonClient]
})
export class ClientsModule {

}