Feature: Almacenar

  Scenario: Crear un nueva tarea de proyecto
    Given El API esta arriba
    When creo una tarea con deadline "2025-03-23" y descripcion "crear e2e tests"
    Then la respuesta debe traer la info de la tarea registrada