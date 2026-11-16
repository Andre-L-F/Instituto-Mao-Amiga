package com.instituto.maoamiga.api.controller;

import com.instituto.maoamiga.api.dto.DoacaoRequestDTO;
import com.instituto.maoamiga.api.dto.DoacaoResponseDTO;
import com.instituto.maoamiga.api.service.DoacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@Tag(name = "Doações", description = "Endpoints para gerenciamento do registro de doações")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping
    @Operation(summary = "Lista todas as doações cadastradas, da mais nova para a mais antiga")
    public java.util.List<DoacaoResponseDTO> listarTodas() {
        return doacaoService.listarTodas();
    }

    @GetMapping("/filtro")
    @Operation(summary = "Busca doações paginadas com filtro por tipo de item, ordenadas da mais recente para a mais antiga")
    public Page<DoacaoResponseDTO> filtrar(
            @RequestParam(required = false) String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return doacaoService.filtrar(filtro, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma doação pelo ID (UUID)")
    public ResponseEntity<DoacaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(doacaoService.buscarPorId(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cadastra uma nova doação com validação dos dados")
    public ResponseEntity<DoacaoResponseDTO> cadastrar(@Valid @RequestBody DoacaoRequestDTO dto) {
        DoacaoResponseDTO cadastrada = doacaoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(cadastrada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma doação existente pelo ID (UUID)")
    public ResponseEntity<DoacaoResponseDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody DoacaoRequestDTO dto
    ) {
        return ResponseEntity.ok(doacaoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Exclui uma doação pelo ID (UUID)")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        doacaoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
