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
        String buscaLimpa = (busca != null && !busca.isBlank()) ? busca.trim() : null;
        String bairroLimpo = (bairro != null && !bairro.isBlank()) ? bairro.trim() : null;
        String tipoLimpo = (tipo != null && !tipo.isBlank()) ? tipo.trim() : null;

        if (buscaLimpa != null || bairroLimpo != null || tipoLimpo != null) {
            pagina = pontoRepository.findByFiltros(buscaLimpa, bairroLimpo, tipoLimpo, safePageable);
        } else {
            pagina = pontoRepository.findAll(safePageable);
        }

        return pagina.map(PontoDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Optional<PontoDTO> buscarPorId(Long id) {
        return pontoRepository.findById(id).map(PontoDTO::fromEntity);
    }

    @Transactional
    public boolean deletar(Long id) {
        if (pontoRepository.existsById(id)) {
            pontoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
