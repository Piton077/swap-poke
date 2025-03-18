
import { ProjectBacklogEntry } from "@domain/entity/project-backlog-entry.entity";
import { nanoid } from "nanoid";

jest.mock('nanoid');

describe('Unit test for project backlog entity',()=>{
    it('create new entry',()=>{
        const fakeId:string = "id";
        (nanoid as jest.Mock).mockReturnValueOnce("id");
        const mockDate = new Date('2025-03-17T12:00:00Z');
        jest.spyOn(global,'Date').mockImplementation(() => mockDate as any);
        const entry = new ProjectBacklogEntry("2025-03-12",'terminar challenge')
        const expected = new ProjectBacklogEntry("2025-03-12",'terminar challenge',"to_do",mockDate.toISOString(),fakeId)
        expect(entry).toEqual(expected)
    })
    afterAll(()=>{
        jest.clearAllMocks()
    })
})