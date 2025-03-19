Feature: Fusionados

  Scenario: Obtener SWAPI caracter con sus pokemones
    Given El API esta arriba
    When busco el caracter con nombre "Luke Skywalker"
    Then la respuesta debe traer la info del registro creado