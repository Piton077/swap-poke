import { ProjectBacklogEntry } from "../entity/project-backlog-entry.entity";

export interface ProjectBacklogRepository {
    saveEntry(entry:ProjectBacklogEntry):Promise<void>
}