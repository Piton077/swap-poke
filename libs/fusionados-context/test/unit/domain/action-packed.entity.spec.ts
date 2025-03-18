import { ActionPackedCharacterEntity } from "@domain/entity/action-packed-character.entity"
import { PlanetVO } from "@domain/vo/planet.vo"
import { PokemonVO } from "@domain/vo/pokemon.vo"

describe("unit testing for action packed character entity", () => {
    it("Create very new action packed", () => {
        const info = {
            "name": "R2-D2",
            "height": "96",
            "mass": "32",
            "hair_color": "n/a",
            "skin_color": "white, blue",
            "eye_color": "red",
            "birth_year": "33BBY",
            "gender": "n/a",
            "planet":{
                "name":"Tatooine",
                "climate":'arid'
            }            
        }
        const fakeDate = new Date()
        jest.spyOn(global,"Date").mockImplementation(()=>fakeDate)
        
        const entity = new ActionPackedCharacterEntity(
            info.name,
            info.birth_year,
            info.eye_color,
            info.gender,
            info.hair_color,
            info.height,
            info.mass,
            info.skin_color,
            new PlanetVO(info.planet.name,info.planet.climate)
        )
        const expected = new ActionPackedCharacterEntity(
            info.name,
            info.birth_year,
            info.eye_color,
            info.gender,
            info.hair_color,
            info.height,
            info.mass,
            info.skin_color,
            new PlanetVO(info.planet.name,info.planet.climate),
            fakeDate.toISOString(),
            []
        )
        expect(entity).toEqual(expected)
    })

    it("set pokemons up to 5", () => {
        const info = {
            "name": "R2-D2",
            "height": "96",
            "mass": "32",
            "hair_color": "n/a",
            "skin_color": "white, blue",
            "eye_color": "red",
            "birth_year": "33BBY",
            "gender": "n/a",
            "planet":{
                "name":"Tatooine",
                "climate":'arid'
            }            
        }
        const fakeDate = new Date()
        jest.spyOn(global,"Date").mockImplementation(()=>fakeDate)
        const slots = 5
        process.env["POKEMON_UPPER_LIMIT"] = slots.toString()
        const entity = new ActionPackedCharacterEntity(
            info.name,
            info.birth_year,
            info.eye_color,
            info.gender,
            info.hair_color,
            info.height,
            info.mass,
            info.skin_color,
            new PlanetVO(info.planet.name,info.planet.climate)
        )
        const pokemons = ["balbasaur","charizard","charmelon","charmelon1","charmelon2","charmelon3","charmelon4"]
        .map(p=>new PokemonVO(p))
        entity.setPokemons(pokemons)
        expect(entity.pokemons).toEqual(pokemons.slice(0,slots).map(x=>x.name))
    })

    it("get homeworld name", () => {
        const info = {
            "name": "R2-D2",
            "height": "96",
            "mass": "32",
            "hair_color": "n/a",
            "skin_color": "white, blue",
            "eye_color": "red",
            "birth_year": "33BBY",
            "gender": "n/a",
            "planet":{
                "name":"Tatooine",
                "climate":'arid'
            }            
        }
        const fakeDate = new Date()
        jest.spyOn(global,"Date").mockImplementationOnce(()=>fakeDate)
        
        const entity = new ActionPackedCharacterEntity(
            info.name,
            info.birth_year,
            info.eye_color,
            info.gender,
            info.hair_color,
            info.height,
            info.mass,
            info.skin_color,
            new PlanetVO(info.planet.name,info.planet.climate)
        )
      
        expect(entity.homeworldName).toEqual(info.planet.name)
    })
    afterAll(()=>{
        jest.clearAllMocks()
    })
})