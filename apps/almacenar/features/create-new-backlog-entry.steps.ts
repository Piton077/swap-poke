import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProjectEntryService, ProjectTrackerContextModule } from '@swapi-monorepo/project-tracker-context';
import { defineFeature, loadFeature } from 'jest-cucumber';
import request from 'supertest';
import { AppController } from "../src/app/app.controller";

const feature = loadFeature('./features/create-new-backlog-entry.feature');

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
    test('Crear un nueva tarea de proyecto', ({ given, when, then }) => {
        let description:string
        let deadline:string
        given('El API esta arriba', async () => {
            app = moduleT.createNestApplication();
            await app.init();
        });
        when(/^creo una tarea con deadline "(.*)" y descripcion "(.*)"$/, async (deadline1,descripcion1) => {
            deadline = deadline1
            description = descripcion1
        });

        then('la respuesta debe traer la info de la tarea registrada', async () => {
            const expected = {
                "id": "3qPV_01nO9yxcDqNjICny",
                "createdAt": "2025-03-19T13:17:43.042Z",
                "deadline": deadline,
                "description": description,
                "status": "to_do"
              }
            jest.spyOn(service,"execute").mockResolvedValueOnce(expected)
            const response = await request(app.getHttpServer())
            .post('/almacenar')
            .send({
                "description":description,
                "deadline":deadline
            })
            .expect(201)
            expect(response.body).toEqual(expected);
        });
    });
    afterAll(async () => {
        await app.close();
      });
});
