package com.instituto.maoamiga.api.controller;

import com.instituto.maoamiga.api.dto.PontoDTO;
import com.instituto.maoamiga.api.service.PontoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping({"/produtos", "/pontos"})
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public Page<PontoDTO> listar(
        @PageableDefault(size = 20) Pageable pageable,
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String filtro,
        @RequestParam(required = false) String termo,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String bairro,
        @RequestParam(required = false) String tipo
    ) {
        String termoBusca = resolverTermoBusca(busca, nome, filtro, termo, q);
        return pontoService.listar(pageable, termoBusca, bairro, tipo);
    }

    @GetMapping("/filtro")
    public Page<PontoDTO> filtrar(
        @PageableDefault(size = 20) Pageable pageable,
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String filtro,
        @RequestParam(required = false) String termo,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String bairro,
        @RequestParam(required = false) String tipo
    ) {
        String termoBusca = resolverTermoBusca(busca, nome, filtro, termo, q);
        return pontoService.listar(pageable, termoBusca, bairro, tipo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoDTO> buscarPorId(@PathVariable("id") Long id) {
        PontoDTO ponto = pontoService.buscarPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ponto com id " + id + " não encontrado."
            ));

        return ResponseEntity.ok(ponto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable("id") Long id) {
        boolean deletado = pontoService.deletar(id);
        if (!deletado) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ponto com id " + id + " não encontrado."
            );
        }

        return ResponseEntity.noContent().build();
    }

    private String resolverTermoBusca(String busca, String nome, String filtro, String termo, String q) {
        if (busca != null && !busca.isBlank()) {
            return busca;
        }
        if (nome != null && !nome.isBlank()) {
            return nome;
        }
        if (filtro != null && !filtro.isBlank()) {
            return filtro;
        }
        if (termo != null && !termo.isBlank()) {
            return termo;
        }
        if (q != null && !q.isBlank()) {
            return q;
        }
        return null;
    }
}
