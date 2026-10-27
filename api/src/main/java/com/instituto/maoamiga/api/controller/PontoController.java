package com.instituto.maoamiga.api.controller;

import com.instituto.maoamiga.api.dto.PontoDTO;
import com.instituto.maoamiga.api.service.PontoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/pontos")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public Page<PontoDTO> listar(
        @PageableDefault(size = 20) Pageable pageable,
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) String bairro,
        @RequestParam(required = false) String tipo
    ) {
        return pontoService.listar(pageable, busca, bairro, tipo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoDTO> buscarPorId(@PathVariable Long id) {
        PontoDTO ponto = pontoService.buscarPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ponto com id " + id + " não encontrado."
            ));

        return ResponseEntity.ok(ponto);
    }
}
