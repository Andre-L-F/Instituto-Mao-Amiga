package com.instituto.maoamiga.api.service;

import com.instituto.maoamiga.api.dto.DoacaoRequestDTO;
import com.instituto.maoamiga.api.dto.DoacaoResponseDTO;
import com.instituto.maoamiga.api.entity.Doacao;
import com.instituto.maoamiga.api.repository.DoacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    @Transactional(readOnly = true)
    public java.util.List<DoacaoResponseDTO> listarTodas() {
        return doacaoRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "criadoEm"))
                .stream()
                .map(DoacaoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        String filtroNormalizado = (filtro != null && !filtro.isBlank()) ? filtro.trim() : null;
        return doacaoRepository.filtrarPorTipoItem(filtroNormalizado, pageable)
                .map(DoacaoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public DoacaoResponseDTO buscarPorId(UUID id) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada com o id: " + id));
        return DoacaoResponseDTO.fromEntity(doacao);
    }

    @Transactional
    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dto) {
        Doacao doacao = Doacao.builder()
                .tipoItem(dto.tipoItem().trim())
                .quantidade(dto.quantidade())
                .pontoDestino(dto.pontoDestino().trim())
                .criadoEm(LocalDateTime.now())
                .build();

        Doacao salva = doacaoRepository.save(doacao);
        return DoacaoResponseDTO.fromEntity(salva);
    }

    @Transactional
    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacaoExistente = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada com o id: " + id));

        doacaoExistente.setTipoItem(dto.tipoItem().trim());
        doacaoExistente.setQuantidade(dto.quantidade());
        doacaoExistente.setPontoDestino(dto.pontoDestino().trim());
        // criadoEm não é alterado na edição!

        Doacao atualizada = doacaoRepository.save(doacaoExistente);
        return DoacaoResponseDTO.fromEntity(atualizada);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!doacaoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada com o id: " + id);
        }
        doacaoRepository.deleteById(id);
    }
}
