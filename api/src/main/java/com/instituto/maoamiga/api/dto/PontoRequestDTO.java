package com.instituto.maoamiga.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PontoRequestDTO(
    @NotBlank(message = "O campo nome é obrigatório e não pode ser vazio.")
    String nome,

    @NotBlank(message = "O campo endereço é obrigatório e não pode ser vazio.")
    String endereco,

    @NotBlank(message = "O campo bairro é obrigatório e não pode ser vazio.")
    String bairro,

    @NotBlank(message = "O campo horário é obrigatório e não pode ser vazio.")
    String horario,

    @NotBlank(message = "O campo tipo é obrigatório e não pode ser vazio.")
    @Pattern(regexp = "(?i)^(coleta|distribuição|distribuicao)$", message = "O tipo deve ser 'coleta' ou 'distribuição'.")
    String tipo
) {}
