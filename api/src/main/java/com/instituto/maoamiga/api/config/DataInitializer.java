package com.instituto.maoamiga.api.config;

import com.instituto.maoamiga.api.entity.Ponto;
import com.instituto.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PontoRepository pontoRepository;

    public DataInitializer(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    @Override
    public void run(String... args) {
        if (pontoRepository.count() == 0) {
            List<Ponto> pontosIniciais = List.of(
                Ponto.builder()
                    .nome("Ponto Central")
                    .endereco("Praça Cívica, 100")
                    .bairro("Setor Central")
                    .horario("Seg a Sex, 8h às 17h")
                    .tipo("coleta")
                    .recebeDistribui("Recebe alimentos não perecíveis e agasalhos.")
                    .latitude(-16.6799)
                    .longitude(-49.2550)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Vila Esperança")
                    .endereco("Avenida Esperança, 450")
                    .bairro("Vila Esperança")
                    .horario("Ter e Qui, 9h às 16h")
                    .tipo("distribuição")
                    .recebeDistribui("Distribui cestas básicas e produtos de higiene.")
                    .latitude(-16.6215)
                    .longitude(-49.2482)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Jardim Novo")
                    .endereco("Rua das Acácias, 85")
                    .bairro("Jardim Novo Mundo")
                    .horario("Sábados, 8h às 13h")
                    .tipo("coleta")
                    .recebeDistribui("Recebe roupas infantis e calçados.")
                    .latitude(-16.6854)
                    .longitude(-49.2141)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Setor Bueno")
                    .endereco("Avenida T-63, 1290")
                    .bairro("Setor Bueno")
                    .horario("Seg a Sex, 9h às 18h")
                    .tipo("coleta")
                    .recebeDistribui("Recebe alimentos e brinquedos novos ou usados.")
                    .latitude(-16.7082)
                    .longitude(-49.2715)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Setor Marista")
                    .endereco("Alameda Ricardo Paranhos, 340")
                    .bairro("Setor Marista")
                    .horario("Seg a Sex, 8h às 19h")
                    .tipo("distribuição")
                    .recebeDistribui("Distribui kits de higiene e cobertores.")
                    .latitude(-16.6991)
                    .longitude(-49.2604)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Campinas")
                    .endereco("Avenida 24 de Outubro, 720")
                    .bairro("Setor Campinas")
                    .horario("Seg a Sex, 8h às 17h30")
                    .tipo("coleta")
                    .recebeDistribui("Recebe roupas, alimentos e materiais escolares.")
                    .latitude(-16.6664)
                    .longitude(-49.2882)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Jardim Goiás")
                    .endereco("Avenida Deputado Jamel Cecílio, 2100")
                    .bairro("Jardim Goiás")
                    .horario("Seg a Sáb, 8h às 18h")
                    .tipo("distribuição")
                    .recebeDistribui("Distribuição de marmitas e alimentos prontos.")
                    .latitude(-16.7031)
                    .longitude(-49.2384)
                    .build(),
                Ponto.builder()
                    .nome("Ponto Leste Universitário")
                    .endereco("Praça Universitária, s/n")
                    .bairro("Setor Leste Universitário")
                    .horario("Seg a Sex, 8h às 16h")
                    .tipo("coleta")
                    .recebeDistribui("Recebe livros, roupas e alimentos para estudantes carentes.")
                    .latitude(-16.6781)
                    .longitude(-49.2435)
                    .build()
            );

            pontoRepository.saveAll(pontosIniciais);
            System.out.println(">>> Carga inicial de pontos realizada com sucesso (" + pontosIniciais.size() + " pontos cadastrados)!");
        }
    }
}
