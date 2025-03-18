
import { CreateProjectEntryCommand } from "@application/use-cases/commands/create-project-entry.command";
import { CreateProjectEntryService } from "@application/use-cases/create-project-entry.service";
import { ProjectBacklogRepository } from "@domain/repository/project-backlog.repository";
import { nanoid } from "nanoid";
jest.mock('nanoid')

describe('Unit test for create project entry service',()=>{
    it('create new entry', async ()=>{
        const id:string = "id";
        const frozendDate = new Date()
        jest.spyOn(global,"Date").mockReturnValueOnce(frozendDate);
        (nanoid as jest.Mock).mockReturnValueOnce("id");
        const repository = {
            saveEntry: jest.fn()
        } as jest.Mocked<ProjectBacklogRepository>;
        const service = new CreateProjectEntryService(repository)
        const command = new CreateProjectEntryCommand("description","1972-02-23")
        const expected = {"createdAt": frozendDate.toISOString(), "deadline": "1972-02-23", "description": "description", "id": id, "status": "to_do"}
        const result = await service.execute(command)
        expect(result).toEqual(expected)
    })
    afterAll(()=>{
        jest.clearAllMocks()
    })
})