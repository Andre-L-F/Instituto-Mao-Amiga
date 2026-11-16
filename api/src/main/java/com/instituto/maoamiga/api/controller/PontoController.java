package com.instituto.maoamiga.api.controller;

import com.instituto.maoamiga.api.dto.PontoRequestDTO;
import com.instituto.maoamiga.api.dto.PontoResponseDTO;
import com.instituto.maoamiga.api.service.PontoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
@Tag(name = "Pontos de Coleta", description = "Endpoints para gerenciamento dos pontos de coleta e distribuição")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    @Operation(summary = "Lista todos os pontos de coleta")
    public List<PontoResponseDTO> listarTodos() {
        return pontoService.listarTodos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um ponto de coleta pelo ID (UUID)")
    public ResponseEntity<PontoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(pontoService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastra um novo ponto de coleta")
    public ResponseEntity<PontoResponseDTO> cadastrar(@Valid @RequestBody PontoRequestDTO dto) {
        PontoResponseDTO cadastrado = pontoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(cadastrado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um ponto de coleta existente pelo ID (UUID)")
    public ResponseEntity<PontoResponseDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody PontoRequestDTO dto
    ) {
        return ResponseEntity.ok(pontoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui um ponto de coleta pelo ID (UUID)")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        pontoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
