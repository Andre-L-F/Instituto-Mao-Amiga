package com.instituto.maoamiga.api.dto;

import com.instituto.maoamiga.api.model.Ponto;

public record PontoDTO(
    Long id,
    String produtoId,
    String nome,
    String endereco,
    String horario,
    String recebeDistribui,
    Double latitude,
    Double longitude
) {
    public static PontoDTO fromEntity(Ponto ponto) {
        if (ponto == null) {
            return null;
        }
        return new PontoDTO(
            ponto.getId(),
            String.valueOf(ponto.getId()),
            ponto.getNome(),
            ponto.getEndereco(),
            ponto.getHorario(),
            ponto.getRecebeDistribui(),
            ponto.getLatitude(),
            ponto.getLongitude()
        );
    }
}
