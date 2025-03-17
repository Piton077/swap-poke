import { nanoid } from "nanoid"

export class ProjectBacklogEntry {
    constructor(
        private _deadline:string,
        private _description: string,
        private _status:string = 'to_do',
        private _createdAt:string = new Date().toISOString(),
        private _id:string = nanoid()
    ) {
     }

    get id() { return this._id }
    get description() { return this._description }
    get createdAt() { return this._createdAt }
    get deadline() {return this._deadline}
    get status() {return this._status}
}