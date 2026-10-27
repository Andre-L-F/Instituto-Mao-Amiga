package com.instituto.maoamiga.api.repository;

import com.instituto.maoamiga.api.model.Ponto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PontoRepository extends JpaRepository<Ponto, Long> {

    @Query("SELECT p FROM Ponto p WHERE " +
           "(:busca IS NULL OR :busca = '' OR " +
           "LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(p.endereco) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(p.horario) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(p.recebeDistribui) LIKE LOWER(CONCAT('%', :busca, '%'))) " +
           "AND (:bairro IS NULL OR :bairro = '' OR LOWER(p.endereco) LIKE LOWER(CONCAT('%', :bairro, '%'))) " +
           "AND (:tipo IS NULL OR :tipo = '' OR LOWER(p.recebeDistribui) LIKE LOWER(CONCAT('%', :tipo, '%')))")
    Page<Ponto> findByFiltros(
        @Param("busca") String busca,
        @Param("bairro") String bairro,
        @Param("tipo") String tipo,
        Pageable pageable
    );
}
