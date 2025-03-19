import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { PaginatedFetchCharacterUseCase } from '../../../libs/fusionados-context/src';
import { AppController } from "../src/app/app.controller";

const feature = loadFeature('./features/historial.feature');

defineFeature(feature, test => {
    let app: INestApplication;
    let moduleT: TestingModule
    let service:PaginatedFetchCharacterUseCase
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers:[PaginatedFetchCharacterUseCase],
                controllers:[AppController]
            })
            .overrideProvider(PaginatedFetchCharacterUseCase)
            .useValue({
                execute:jest.fn()
            })
            .compile();
            moduleT = module
            service = module.get<PaginatedFetchCharacterUseCase>(PaginatedFetchCharacterUseCase)
        });
    test('Obtener fusionados historial de registro', ({ given, when, then }) => {
        let limit:string
        given('El API esta arriba', async () => {
            app = moduleT.createNestApplication();
            await app.init();
        });
        when(/^buscos los registros con limite "(.*)"$/, async (limit1) => {
            limit = limit1
        });

        then('la respuesta debe traer el historial ordenado descendentemente por fecha de creacion', async () => {
            const expected ={
                "items": [
                  {
                    "birthYear": "19BBY",
                    "createdAt": "2025-03-19T13:54:53.443Z",
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
                ],
                "cursor": null
              }
            jest.spyOn(service,"execute").mockResolvedValueOnce(expected)
            const response = await request(app.getHttpServer())
            .get(`/fusionados/historial?limit=${limit}`)
            .expect(200)
            expect(response.body).toEqual(expected);
        });
    });
    afterAll(async () => {
        await app.close();
      });
});
