import { Module } from "@nestjs/common";
import { SharedModule } from "@swapi-monorepo/shared";
import { PokemonClient } from "./pokemon/pokemon.client";
import { SWAPIClient } from "./swapi/swapi.client";

@Module({
    imports:[SharedModule],
    providers:[
        SWAPIClient,
        PokemonClient
    ],
    exports:[SWAPIClient,PokemonClient]
})
export class ClientsModule {

}