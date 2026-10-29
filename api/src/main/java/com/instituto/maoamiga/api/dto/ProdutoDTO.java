package com.instituto.maoamiga.api.dto;

import com.instituto.maoamiga.api.model.Ponto;

public record ProdutoDTO(
    String produtoId,
    String nome,
    String descricao,
    Double preco
) {
    public static ProdutoDTO fromPonto(Ponto ponto) {
        if (ponto == null) {
            return null;
        }
        return new ProdutoDTO(
            String.valueOf(ponto.getId()),
            ponto.getNome(),
            ponto.getRecebeDistribui(),
            0.0
        );
    }
}
