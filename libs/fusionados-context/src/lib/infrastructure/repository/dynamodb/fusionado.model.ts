export class FusionadoModel {
    constructor(
        public name: string,
        public birthYear: string,
        public eyeColor: string,
        public gender: string,
        public hairColor: string,
        public height:string,
        public mass:string,
        public createdAt: string,
        public skinColor: string,
        public pokemons: string[],
        public planet: {
            name:string
            climate:string
        }
    ) { }
}