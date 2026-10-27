package com.instituto.maoamiga.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pontos")
public class Ponto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String horario;

    @Column(nullable = false, length = 1000)
    private String recebeDistribui;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    public Ponto() {
    }

    public Ponto(Long id, String nome, String endereco, String horario, String recebeDistribui, Double latitude, Double longitude) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.horario = horario;
        this.recebeDistribui = recebeDistribui;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Ponto(String nome, String endereco, String horario, String recebeDistribui, Double latitude, Double longitude) {
        this(null, nome, endereco, horario, recebeDistribui, latitude, longitude);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getRecebeDistribui() {
        return recebeDistribui;
    }

    public void setRecebeDistribui(String recebeDistribui) {
        this.recebeDistribui = recebeDistribui;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
