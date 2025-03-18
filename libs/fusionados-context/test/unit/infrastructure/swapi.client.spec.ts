import { ActionPackedCharacterEntity } from "@domain/entity/action-packed-character.entity";
import { PlanetVO } from "@domain/vo/planet.vo";
import { SWAPIGetPeople } from "@infrastructure/clients/swapi/dto/people.dto";
import { PlanetDto } from "@infrastructure/clients/swapi/dto/planet.dto";
import { SWAPIClient } from "@infrastructure/clients/swapi/swapi.client";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from '@nestjs/testing';
import { HttpCacheableClientService } from "@swapi-monorepo/shared";


describe("Unit test for swapi client", () => {
    let httpCacheableClientService: HttpCacheableClientService
    let swapiClient: SWAPIClient
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HttpCacheableClientService, SWAPIClient]
        })
            .overrideProvider(HttpCacheableClientService)
            .useValue({
                request: jest.fn()
            })
            .compile();
        httpCacheableClientService = module.get<HttpCacheableClientService>(HttpCacheableClientService)
        swapiClient = module.get<SWAPIClient>(SWAPIClient);
    });
    it("matching swapi character", async () => {
        const peopleResult: SWAPIGetPeople = {
            count: 1,
            next: null,
            previous: null,
            results: [{
                "name": "R2-D2",
                "height": "96",
                "mass": "32",
                "hair_color": "n/a",
                "skin_color": "white, blue",
                "eye_color": "red",
                "birth_year": "33BBY",
                "gender": "n/a",
                "homeworld": "https://swapi.py4e.com/api/planets/8/",
                "films": [
                    "https://swapi.py4e.com/api/films/1/",
                    "https://swapi.py4e.com/api/films/2/",
                    "https://swapi.py4e.com/api/films/3/",
                    "https://swapi.py4e.com/api/films/4/",
                    "https://swapi.py4e.com/api/films/5/",
                    "https://swapi.py4e.com/api/films/6/",
                    "https://swapi.py4e.com/api/films/7/"
                ],
                "species": [
                    "https://swapi.py4e.com/api/species/2/"
                ],
                "vehicles": [],
                "starships": [],
                "created": "2014-12-10T15:11:50.376000Z",
                "edited": "2014-12-20T21:17:50.311000Z",
                "url": "https://swapi.py4e.com/api/people/3/"
            }]
        }
        const planetResult: PlanetDto = {
            "name": "Tatooine",
            "climate": "arid"
        }
        const people = peopleResult.results[0]
        const fakeDate = new Date()
        jest.spyOn(global, "Date").mockImplementation(() => fakeDate)
        jest.spyOn(httpCacheableClientService, "request").mockResolvedValueOnce(peopleResult)
        jest.spyOn(httpCacheableClientService, "request").mockResolvedValueOnce(planetResult)
        const expected = new ActionPackedCharacterEntity(
            people.name,
            people.birth_year,
            people.eye_color,
            people.gender,
            people.hair_color,
            people.height,
            people.mass,
            people.skin_color,
            new PlanetVO(planetResult.name, planetResult.climate),
            fakeDate.toISOString()
        )
        const character = await swapiClient.findPeopleByName("obi-wan")
        expect(character).toEqual(expected)
    })

    it("over two matching swapi character throw internal server exception ", async () => {
        expect.assertions(1)
        const peopleResult: SWAPIGetPeople = {
            count: 2,
            next: null,
            previous: null,
            results: [{
                "name": "R2-D2",
                "height": "96",
                "mass": "32",
                "hair_color": "n/a",
                "skin_color": "white, blue",
                "eye_color": "red",
                "birth_year": "33BBY",
                "gender": "n/a",
                "homeworld": "https://swapi.py4e.com/api/planets/8/",
                "films": [
                    "https://swapi.py4e.com/api/films/1/",
                    "https://swapi.py4e.com/api/films/2/",
                    "https://swapi.py4e.com/api/films/3/",
                    "https://swapi.py4e.com/api/films/4/",
                    "https://swapi.py4e.com/api/films/5/",
                    "https://swapi.py4e.com/api/films/6/",
                    "https://swapi.py4e.com/api/films/7/"
                ],
                "species": [
                    "https://swapi.py4e.com/api/species/2/"
                ],
                "vehicles": [],
                "starships": [],
                "created": "2014-12-10T15:11:50.376000Z",
                "edited": "2014-12-20T21:17:50.311000Z",
                "url": "https://swapi.py4e.com/api/people/3/"
            },
            {
                "name": "Boba Fett",
                "height": "183",
                "mass": "78.2",
                "hair_color": "black",
                "skin_color": "fair",
                "eye_color": "brown",
                "birth_year": "31.5BBY",
                "gender": "male",
                "homeworld": "https://swapi.py4e.com/api/planets/10/",
                "films": [
                    "https://swapi.py4e.com/api/films/2/",
                    "https://swapi.py4e.com/api/films/3/",
                    "https://swapi.py4e.com/api/films/5/"
                ],
                "species": [
                    "https://swapi.py4e.com/api/species/1/"
                ],
                "vehicles": [],
                "starships": [
                    "https://swapi.py4e.com/api/starships/21/"
                ],
                "created": "2014-12-15T12:49:32.457000Z",
                "edited": "2014-12-20T21:17:50.349000Z",
                "url": "https://swapi.py4e.com/api/people/22/"
            },
            {
                "name": "Lobot",
                "height": "175",
                "mass": "79",
                "hair_color": "none",
                "skin_color": "light",
                "eye_color": "blue",
                "birth_year": "37BBY",
                "gender": "male",
                "homeworld": "https://swapi.py4e.com/api/planets/6/",
                "films": [
                    "https://swapi.py4e.com/api/films/2/"
                ],
                "species": [
                    "https://swapi.py4e.com/api/species/1/"
                ],
                "vehicles": [],
                "starships": [],
                "created": "2014-12-15T13:01:57.178000Z",
                "edited": "2014-12-20T21:17:50.359000Z",
                "url": "https://swapi.py4e.com/api/people/26/"
            }
            ]
        }
        
        jest.spyOn(httpCacheableClientService, "request").mockResolvedValueOnce(peopleResult)
        try {
            await swapiClient.findPeopleByName("obi-wan")
        } catch (error) {
            expect(error).toEqual(new InternalServerErrorException("Hay mas de un personaje, debe ingresar un nombre mas especifico. Mas info SWAPI /people"))
        }
       
    })

    it("no swapi character throw not found exception ", async () => {
        expect.assertions(1)
        const peopleResult: SWAPIGetPeople = {
            count: 0,
            next: null,
            previous: null,
            results:[]
        }
        jest.spyOn(httpCacheableClientService, "request").mockResolvedValueOnce(peopleResult)
        try {
            await swapiClient.findPeopleByName("obi-wan")
        } catch (error) {
            expect(error).toEqual(new NotFoundException("No se encontro personaje con ese nombre"))
        }
       
    })
    afterAll(()=>{
        jest.clearAllMocks()
    })
})