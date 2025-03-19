import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectEntryService, ProjectTrackerContextModule } from '@swapi-monorepo/project-tracker-context';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { AppController } from "../src/app/app.controller";

const feature = loadFeature('./features/sample.feature');

defineFeature(feature, test => {
    let app: INestApplication;
    let moduleT: TestingModule
    let service:CreateProjectEntryService
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                imports: [ProjectTrackerContextModule],
                controllers:[AppController]
            })
            .overrideProvider(CreateProjectEntryService)
            .useValue({
                execute:jest.fn()
            })
            .compile();
            moduleT = module
            service = module.get<CreateProjectEntryService>(CreateProjectEntryService)
        });
    test('Obtener SWAPI caracter con sus pokemones', ({ given, when, then }) => {
        given('El API esta arriba', async () => {
            app = moduleT.createNestApplication();
            await app.init();
        });

        when(/^busco el caracter con nombre "(.*)"$/, async (nombre) => {
            jest.spyOn(service,"execute").mockResolvedValueOnce()
            return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
        });

        then('la respuesta debe traer la info del registro creado', () => {
            expect(100).toBe(200);
        });
    });
    afterAll(async () => {
        await app.close();
      });
});
