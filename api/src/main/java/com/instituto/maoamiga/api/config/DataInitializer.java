package com.instituto.maoamiga.api.config;

import com.instituto.maoamiga.api.entity.Doacao;
import com.instituto.maoamiga.api.entity.Ponto;
import com.instituto.maoamiga.api.repository.DoacaoRepository;
import com.instituto.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PontoRepository pontoRepository;
    private final DoacaoRepository doacaoRepository;

    public DataInitializer(PontoRepository pontoRepository, DoacaoRepository doacaoRepository) {
        this.pontoRepository = pontoRepository;
        this.doacaoRepository = doacaoRepository;
    }

    @Override
    public void run(String... args) {
        if (pontoRepository.count() == 0) {
            List<Ponto> pontos = List.of(
                criar("Ponto Central", "Praça Cívica, 100", "Setor Central", "Seg a Sex, 8h às 17h", "coleta"),
                criar("Ponto Vila Esperança", "Avenida Esperança, 450", "Vila Esperança", "Ter e Qui, 9h às 16h", "distribuição"),
                criar("Ponto Jardim Novo", "Rua das Acácias, 85", "Jardim Novo Mundo", "Sábados, 8h às 13h", "coleta"),
                criar("Ponto Setor Bueno", "Avenida T-63, 1290", "Setor Bueno", "Seg a Sex, 9h às 18h", "coleta"),
                criar("Ponto Setor Marista", "Alameda Ricardo Paranhos, 340", "Setor Marista", "Seg a Sex, 8h às 19h", "distribuição"),
                criar("Ponto Campinas", "Avenida 24 de Outubro, 720", "Setor Campinas", "Seg a Sex, 8h às 17h30", "coleta"),
                criar("Ponto Jardim Goiás", "Avenida Deputado Jamel Cecílio, 2100", "Jardim Goiás", "Seg a Sáb, 8h às 18h", "distribuição"),
                criar("Ponto Leste Universitário", "Praça Universitária, s/n", "Setor Leste Universitário", "Seg a Sex, 8h às 16h", "coleta"),
                criar("Ponto Setor Oeste", "Praça Tamandaré, 45", "Setor Oeste", "Seg a Sex, 8h às 18h", "coleta"),
                criar("Ponto Setor Sul", "Rua 84, 520", "Setor Sul", "Seg a Sex, 9h às 17h", "distribuição"),
                criar("Ponto Pedro Ludovico", "Avenida Circular, 880", "Setor Pedro Ludovico", "Seg a Sex, 8h às 17h", "coleta"),
                criar("Ponto Jardim América", "Avenida C-104, 310", "Jardim América", "Seg a Sex, 8h às 18h", "coleta"),
                criar("Ponto Vila Nova", "5ª Avenida, 600", "Setor Leste Vila Nova", "Seg a Sex, 8h às 16h", "distribuição"),
                criar("Ponto Nova Suíça", "Avenida C-233, 150", "Setor Nova Suíça", "Seg a Sex, 8h30 às 17h30", "coleta"),
                criar("Ponto Urias Magalhães", "Avenida Rio Branco, 400", "Setor Urias Magalhães", "Ter e Sex, 9h às 15h", "distribuição"),
                criar("Ponto Setor Coimbra", "Rua 240, 115", "Setor Coimbra", "Seg a Sex, 8h às 17h", "coleta"),
                criar("Ponto Setor Jaó", "Avenida Quitandinha, 210", "Setor Jaó", "Sábados, 8h às 12h", "coleta"),
                criar("Ponto Negrão de Lima", "Rua 208, 95", "Setor Negrão de Lima", "Seg a Sex, 8h às 16h30", "distribuição"),
                criar("Ponto Parque Amazônia", "Avenida José Rodrigues Morais Neto, 1400", "Parque Amazônia", "Seg a Sex, 9h às 18h", "coleta"),
                criar("Ponto Jardim Curitiba", "Avenida do Povo, 750", "Jardim Curitiba", "Seg a Sex, 8h às 17h", "distribuição"),
                criar("Ponto Vera Cruz", "Avenida Gercina Borges Teixeira, 1100", "Conjunto Vera Cruz", "Seg a Sáb, 8h às 14h", "coleta"),
                criar("Ponto Faiçalville", "Avenida Madrid, 320", "Setor Faiçalville", "Ter e Qui, 8h às 16h", "distribuição"),
                criar("Ponto Eldorado", "Avenida Milão, 1850", "Residencial Eldorado", "Seg a Sex, 9h às 18h", "coleta"),
                criar("Ponto Parque das Laranjeiras", "Avenida das Laranjeiras, 450", "Parque das Laranjeiras", "Seg a Sex, 8h às 17h", "coleta"),
                criar("Ponto Balneário Meia Ponte", "Avenida Nerópolis, 890", "Balneário Meia Ponte", "Seg a Sex, 8h às 16h", "distribuição"),
                criar("Ponto Aeroporto", "Rua 17-A, 280", "Setor Aeroporto", "Seg a Sex, 8h às 17h30", "coleta")
            );

            pontoRepository.saveAll(pontos);
            System.out.println(">>> Carga inicial de " + pontos.size() + " pontos realizada com sucesso!");
        }

        if (doacaoRepository.count() == 0) {
            List<Doacao> doacoesIniciais = List.of(
                Doacao.builder()
                    .tipoItem("Alimentos não perecíveis")
                    .quantidade(25)
                    .pontoDestino("Ponto Central")
                    .criadoEm(LocalDateTime.now().minusDays(3))
                    .build(),
                Doacao.builder()
                    .tipoItem("Agasalhos e Cobertores")
                    .quantidade(10)
                    .pontoDestino("Ponto Setor Bueno")
                    .criadoEm(LocalDateTime.now().minusDays(2))
                    .build(),
                Doacao.builder()
                    .tipoItem("Kits de Higiene")
                    .quantidade(15)
                    .pontoDestino("Ponto Vila Esperança")
                    .criadoEm(LocalDateTime.now().minusDays(1))
                    .build(),
                Doacao.builder()
                    .tipoItem("Leite em pó e Fraldas")
                    .quantidade(30)
                    .pontoDestino("Ponto Jardim Goiás")
                    .criadoEm(LocalDateTime.now().minusHours(5))
                    .build()
            );

            doacaoRepository.saveAll(doacoesIniciais);
            System.out.println(">>> [N2-5] Carga inicial de " + doacoesIniciais.size() + " doações realizada com sucesso!");
        }
    }

    private Ponto criar(String nome, String endereco, String bairro, String horario, String tipo) {
        return Ponto.builder()
                .nome(nome)
                .endereco(endereco)
                .bairro(bairro)
                .horario(horario)
                .tipo(tipo)
                .build();
    }
}
