import { EvaluateSuitablePokemonService } from "@domain/services/evaluate-suitable-pokemon"
import { PlanetVO } from "@domain/vo/planet.vo"

describe("Unit test for evaluate suitable pokemon", () => {
    it("paring planet with a pokemon type, return most suitable pokemon", () => {
        const service = new EvaluateSuitablePokemonService()
        const tatooine = new PlanetVO("Tatooine", "arid")
        const types: string[] = ["ground", "fire", "rock"]
        const result = service.getSuitablePokemonType(tatooine)
        expect(result).toEqual(types)
    })
    it("no suitable pokemon was found, return empty array ", () => {
        const service = new EvaluateSuitablePokemonService()
        const tatooine = new PlanetVO("Tatooine", "arid23")
        const result = service.getSuitablePokemonType(tatooine)
        expect(result).toEqual([])
    })
})