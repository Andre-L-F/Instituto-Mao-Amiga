package com.instituto.maoamiga.api.service;

import com.instituto.maoamiga.api.dto.PontoRequestDTO;
import com.instituto.maoamiga.api.dto.PontoResponseDTO;
import com.instituto.maoamiga.api.entity.Ponto;
import com.instituto.maoamiga.api.repository.PontoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PontoService {

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    @Transactional(readOnly = true)
    public List<PontoResponseDTO> listarTodos() {
        return pontoRepository.findAll()
                .stream()
                .map(PontoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<PontoResponseDTO> buscarPaginado(String filtro, Pageable pageable) {
        String filtroNormalizado = (filtro != null && !filtro.isBlank()) ? filtro.trim() : null;
        return pontoRepository.buscarPorNomeOuBairro(filtroNormalizado, pageable)
                .map(PontoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public PontoResponseDTO buscarPorId(UUID id) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado com o id: " + id));
        return PontoResponseDTO.fromEntity(ponto);
    }

    @Transactional
    public PontoResponseDTO cadastrar(PontoRequestDTO dto) {
        Ponto ponto = Ponto.builder()
                .nome(dto.nome().trim())
                .endereco(dto.endereco().trim())
                .bairro(dto.bairro().trim())
                .horario(dto.horario().trim())
                .tipo(dto.tipo().trim().toLowerCase())
                .build();

        Ponto salvo = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dto) {
        Ponto pontoExistente = pontoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado com o id: " + id));

        pontoExistente.setNome(dto.nome().trim());
        pontoExistente.setEndereco(dto.endereco().trim());
        pontoExistente.setBairro(dto.bairro().trim());
        pontoExistente.setHorario(dto.horario().trim());
        pontoExistente.setTipo(dto.tipo().trim().toLowerCase());

        Ponto atualizado = pontoRepository.save(pontoExistente);
        return PontoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!pontoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado com o id: " + id);
        }
        pontoRepository.deleteById(id);
    }
}
