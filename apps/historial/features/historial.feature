Feature: Historial

  Scenario: Obtener fusionados historial de registro
    Given El API esta arriba
    When buscos los registros con limite "limite"
    Then la respuesta debe traer el historial ordenado descendentemente por fecha de creacion