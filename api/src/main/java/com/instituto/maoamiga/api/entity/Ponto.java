package com.instituto.maoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "pontos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String bairro;

    @Column(nullable = false)
    private String horario;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = true)
    private String recebeDistribui;

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    public Ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        this(null, nome, endereco, bairro, horario, tipo, null, null, null);
    }
}
