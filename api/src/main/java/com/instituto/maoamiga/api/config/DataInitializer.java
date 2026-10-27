package com.instituto.maoamiga.api.config;

import com.instituto.maoamiga.api.model.Ponto;
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
                new Ponto(
                    "Ponto Central",
                    "Praça Cívica, 100 - Setor Central, Goiânia - GO",
                    "Segunda a sexta, das 8h às 17h",
                    "Recebe alimentos não perecíveis e roupas. Distribui cestas básicas e roupas.",
                    -16.6799,
                    -49.2550
                ),
                new Ponto(
                    "Ponto Vila Esperança",
                    "Avenida Esperança, 450 - Vila Esperança, Goiânia - GO",
                    "Terças e quintas, das 9h às 16h",
                    "Recebe alimentos, produtos de higiene e roupas infantis. Distribui alimentos e roupas para famílias cadastradas.",
                    -16.6215,
                    -49.2482
                ),
                new Ponto(
                    "Ponto Jardim Novo",
                    "Rua das Acácias, 85 - Jardim Novo Mundo, Goiânia - GO",
                    "Sábados, das 8h às 13h",
                    "Recebe alimentos frescos e roupas. Distribui alimentos e kits de roupas.",
                    -16.6854,
                    -49.2141
                ),
                new Ponto(
                    "Ponto Setor Bueno",
                    "Avenida T-63, 1290 - Setor Bueno, Goiânia - GO",
                    "Segunda a sexta, das 9h às 18h",
                    "Recebe alimentos, agasalhos, cobertores e calçados. Distribui cestas básicas e kits de inverno.",
                    -16.7082,
                    -49.2715
                ),
                new Ponto(
                    "Ponto Setor Marista",
                    "Alameda Ricardo Paranhos, 540 - Setor Marista, Goiânia - GO",
                    "Segunda a sexta, das 8h às 17h",
                    "Recebe leite em pó, fraldas descartáveis e itens de higiene pessoal. Distribui kits para mães e bebês.",
                    -16.6991,
                    -49.2604
                ),
                new Ponto(
                    "Ponto Campinas",
                    "Avenida 24 de Outubro, 755 - Setor Campinas, Goiânia - GO",
                    "Segunda a sexta, das 8h às 16h30",
                    "Recebe roupas masculinas e femininas, calçados e alimentos. Distribui refeições e roupas.",
                    -16.6664,
                    -49.2882
                ),
                new Ponto(
                    "Ponto Jardim Goiás",
                    "Avenida Deputado Jamel Cecílio, 3300 - Jardim Goiás, Goiânia - GO",
                    "Segunda a sábado, das 9h às 18h",
                    "Recebe alimentos não perecíveis, brinquedos e livros. Distribui cestas de alimentos e kits escolares.",
                    -16.7031,
                    -49.2384
                ),
                new Ponto(
                    "Ponto Leste Universitário",
                    "Praça Universitária, s/n - Setor Leste Universitário, Goiânia - GO",
                    "Segunda a sexta, das 8h às 19h",
                    "Recebe livros didáticos, cadernos, lápis e materiais escolares. Distribui kits de estudo para estudantes carentes.",
                    -16.6781,
                    -49.2435
                ),
                new Ponto(
                    "Ponto Vila Nova",
                    "5ª Avenida, 210 - Setor Leste Vila Nova, Goiânia - GO",
                    "Quartas e sábados, das 8h às 14h",
                    "Recebe hortaliças, alimentos frescos e roupas de cama. Distribui sopão comunitário e cestas verdes.",
                    -16.6693,
                    -49.2396
                )
            );

            pontoRepository.saveAll(pontosIniciais);
        }
    }
}
