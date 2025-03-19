Feature: Fusionados

  Scenario: Obtener SWAPI caracter y sus pokemones
    Given El API esta arriba
    When busco el caracter SWAPI con nombre "2025-03-23"
    Then la respuesta debe traer la info del caracter con su info