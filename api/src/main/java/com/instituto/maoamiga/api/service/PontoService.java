package com.instituto.maoamiga.api.service;

import com.instituto.maoamiga.api.dto.PontoDTO;
import com.instituto.maoamiga.api.model.Ponto;
import com.instituto.maoamiga.api.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PontoService {

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    @Transactional(readOnly = true)
    public Page<PontoDTO> listar(Pageable pageable, String busca, String bairro, String tipo) {
        // Garante no máximo 50 itens por página
        int pageSize = Math.min(pageable.getPageSize(), 50);
        Pageable safePageable = PageRequest.of(pageable.getPageNumber(), pageSize, pageable.getSort());

        Page<Ponto> pagina;
        if ((busca != null && !busca.isBlank()) ||
            (bairro != null && !bairro.isBlank()) ||
            (tipo != null && !tipo.isBlank())) {
            pagina = pontoRepository.findByFiltros(busca, bairro, tipo, safePageable);
        } else {
            pagina = pontoRepository.findAll(safePageable);
        }

        return pagina.map(PontoDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Optional<PontoDTO> buscarPorId(Long id) {
        return pontoRepository.findById(id).map(PontoDTO::fromEntity);
    }
}
