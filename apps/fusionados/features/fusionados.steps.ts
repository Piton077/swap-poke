import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { FetchCharacterUseCase } from '../../../libs/fusionados-context/src';
import { AppController } from "../src/app/app.controller";

const feature = loadFeature('./features/fusionados.feature');

defineFeature(feature, test => {
    let app: INestApplication;
    let moduleT: TestingModule
    let service:FetchCharacterUseCase
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers:[FetchCharacterUseCase],
                controllers:[AppController]
            })
            .overrideProvider(FetchCharacterUseCase)
            .useValue({
                execute:jest.fn()
            })
            .compile();
            moduleT = module
            service = module.get<FetchCharacterUseCase>(FetchCharacterUseCase)
        });
    test('Obtener SWAPI caracter y sus pokemones', ({ given, when, then }) => {
        let name:string
        given('El API esta arriba', async () => {
            app = moduleT.createNestApplication();
            await app.init();
        });
        when(/^busco el caracter SWAPI con nombre "(.*)"$/, async (name1) => {
            name = name1
        });

        then('la respuesta debe traer la info del caracter con su info', async () => {
            const expected = {
                "birthYear": "19BBY",
                "createdAt": "2025-03-19T13:45:38.761Z",
                "eyeColor": "blue",
                "gender": "male",
                "hairColor": "blond",
                "height": "172",
                "mass": "77",
                "name": "Luke Skywalker",
                "planet": "Tatooine",
                "pokemons": [
                  "sandshrew",
                  "sandslash",
                  "nidoqueen",
                  "nidoking",
                  "diglett",
                  "dugtrio",
                  "geodude",
                  "graveler",
                  "golem",
                  "onix"
                ],
                "skinColor": "fair"
              }
            jest.spyOn(service,"execute").mockResolvedValueOnce(expected)
            const response = await request(app.getHttpServer())
            .get(`/fusionados/${name}`)
            .expect(201)
            expect(response.body).toEqual(expected);
        });
    });
    afterAll(async () => {
        await app.close();
      });
});
