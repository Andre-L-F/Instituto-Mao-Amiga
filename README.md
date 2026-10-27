# Instituto Mão Amiga

Aplicativo mobile desenvolvido em React Native com Expo e TypeScript para visualização de pontos de coleta e gerenciamento de doações, integrado a uma API própria em Spring Boot.

## 📌 Issue #16: App em camadas e API do Instituto Mão Amiga para os pontos de coleta

Nesta versão, a aplicação foi reestruturada em camadas e conectada a uma API REST desenvolvida em Spring Boot:
- **API Spring Boot**: Armazena e gerencia os pontos de coleta em banco de dados H2, com paginação e coordenadas geográficas reais de Goiânia.
- **App em camadas**: Código separado em `types/`, `services/` e `screens/`, com navegação tipada via React Navigation (`RootStackParamList` e `NativeStackScreenProps`), consumo centralizado da API via `fetch` em `src/services/api.ts`, e persistência local de doações em `src/services/doacoesStorage.ts` baseada em armazenamento genérico.

---

## 🏗️ Estrutura do Projeto

O projeto contém o aplicativo mobile na raiz e a API Spring Boot na pasta `api/`:

```text
instituto-mao-amiga/
├── api/                                      # API REST Spring Boot
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/instituto/maoamiga/api/
│       │   ├── config/                       # CorsConfig e DataInitializer (carga inicial)
│       │   ├── controller/                   # PontoController (endpoints REST)
│       │   ├── dto/                          # PontoDTO (record retornado pela API)
│       │   ├── model/                        # Ponto (entidade JPA)
│       │   ├── repository/                   # PontoRepository (Spring Data JPA)
│       │   ├── service/                      # PontoService (regras e paginação)
│       │   └── InstitutoMaoAmigaApiApplication.java
│       └── resources/
│           └── application.properties        # Configurações do H2 e Spring Data
│
├── src/                                      # Código-fonte do App React Native
│   ├── components/
│   │   └── ItemDoacao.tsx                    # Componente de item da lista de doações
│   ├── screens/
│   │   ├── ListaPontos.tsx                   # Lista de pontos consumida da API
│   │   ├── DetalhePonto.tsx                  # Detalhe do ponto buscado por id na API
│   │   ├── CadastroDoacao.tsx                # Cadastro com seleção dos pontos da API
│   │   ├── HistoricoDoacoes.tsx              # Histórico, resumo de totais e filtros
│   │   └── DetalheDoacao.tsx                 # Detalhe da doação com edição e exclusão
│   ├── services/
│   │   ├── api.ts                            # Único ponto do app que chama fetch
│   │   ├── pontosService.ts                  # Listagem e busca de pontos por id
│   │   ├── storage.ts                        # Funções genéricas lerJSON<T> e salvarJSON<T>
│   │   └── doacoesStorage.ts                 # Armazenamento e persistência das doações
│   ├── styles/
│   │   └── styles.tsx                        # Folha de estilos padronizada
│   └── types/
│       ├── ponto.ts                          # Interface Ponto espelhando o record da API
│       ├── doacao.ts                         # Interface Doacao com quantidade numérica
│       └── navigation.ts                     # RootStackParamList e props de tela
├── App.tsx                                   # Ponto de entrada (apenas navegação)
├── package.json
└── tsconfig.json                             # TypeScript estrito (strict: true)
```

---

## ☕ API Spring Boot (`api/`)

A API foi desenvolvida em Java com **Spring Boot 3**, **Spring Web**, **Spring Data JPA** e banco de dados **H2**:

### Endpoints
- `GET /pontos`
  - Paginação via parâmetros `page`, `size` e `sort` (ex.: `GET /pontos?page=0&size=20&sort=nome,asc`).
  - Padrão: 20 itens por página; máximo permitido: 50 itens.
  - Retorna o formato `Page` do Spring Data (`content` e `page` com metadados).
  - Parâmetros opcionais de busca: `busca`, `bairro`, `tipo`.
- `GET /pontos/{id}`
  - Retorna o `PontoDTO` correspondente.
  - Caso o ID não exista, responde com status **HTTP 404 Not Found** (em vez de 500).

### Carga Inicial
Ao iniciar, o serviço insere automaticamente pelo menos 8 pontos de coleta e distribuição em Goiânia com coordenadas geográficas reais:
1. **Ponto Central** (Praça Cívica - Setor Central) - Lat: -16.6799, Long: -49.2550
2. **Ponto Vila Esperança** (Av. Esperança - Vila Esperança) - Lat: -16.6215, Long: -49.2482
3. **Ponto Jardim Novo** (Rua das Acácias - Jardim Novo Mundo) - Lat: -16.6854, Long: -49.2141
4. **Ponto Setor Bueno** (Av. T-63 - Setor Bueno) - Lat: -16.7082, Long: -49.2715
5. **Ponto Setor Marista** (Al. Ricardo Paranhos - Setor Marista) - Lat: -16.6991, Long: -49.2604
6. **Ponto Campinas** (Av. 24 de Outubro - Setor Campinas) - Lat: -16.6664, Long: -49.2882
7. **Ponto Jardim Goiás** (Av. Dep. Jamel Cecílio - Jardim Goiás) - Lat: -16.7031, Long: -49.2384
8. **Ponto Leste Universitário** (Praça Universitária) - Lat: -16.6781, Long: -49.2435
9. **Ponto Vila Nova** (5ª Avenida - Setor Leste Vila Nova) - Lat: -16.6693, Long: -49.2396

### Como executar a API

Na pasta `api/`:

```bash
cd api
mvn spring-boot:run
```

Ou no Windows com o Maven instalado:
```bash
mvn clean install
java -jar target/api-1.0.0.jar
```

- A API estará disponível em `http://localhost:8080`.
- Console H2 disponível em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:maoamigadb`, Usuário: `sa`, Senha em branco).

---

## 📱 Aplicativo Mobile React Native

### Configuração da URL da API
No arquivo `src/services/api.ts`:
- Emuladores Android acessam o host através de `http://10.0.2.2:8080`.
- iOS e navegadores web acessam através de `http://localhost:8080`.
- Caso utilize um aparelho físico conectado na mesma rede Wi-Fi, substitua pelo IP local da sua máquina (ex.: `http://192.168.1.X:8080`).

### Como executar o App

1. Instale as dependências:
```bash
npm install
```

2. Valide os tipos TypeScript:
```bash
npx tsc --noEmit
```

3. Inicie o Metro Bundler do Expo:
```bash
npx expo start
```

---

## ✅ Critérios de Aceite Atendidos (refs #16)

- [x] **API Spring Boot** com Spring Web, Spring Data JPA e H2.
- [x] Entidade `Ponto` com `latitude` e `longitude` (`Double`).
- [x] Carga inicial com 9 pontos reais em Goiânia com coordenadas geográficas.
- [x] `GET /pontos` paginado (padrão 20, máximo 50) retornando DTO (`PontoDTO`).
- [x] `GET /pontos/{id}` retornando 404 quando o ponto não existe.
- [x] O controller devolve `record` (DTO), nunca a entidade JPA.
- [x] `tsconfig.json` com `"strict": true` e `npx tsc --noEmit` rodando com 0 erros, sem `any` ou `@ts-ignore`.
- [x] Estrutura organizada com `src/types/`, `src/services/` e `src/screens/`.
- [x] `App.tsx` apenas monta a navegação com `@react-navigation/native-stack`.
- [x] Tipos `Ponto` e `Doacao` em `src/types/`, com `quantidade` numérica.
- [x] Armazenamento de doações em `src/services/doacoesStorage.ts` construído sobre `lerJSON<T>` e `salvarJSON<T>`. Nenhuma tela importa `AsyncStorage`.
- [x] Rotas tipadas com `RootStackParamList` e todas as telas com `NativeStackScreenProps`.
- [x] Único arquivo chamando `fetch`: `src/services/api.ts`.
- [x] `src/services/pontosService.ts` com funções `listarPontos` e `buscarPontoPorId`. Nenhuma tela monta URL ou chama fetch.
- [x] Lista de pontos mostra os dados da API (array fixo de mocks removido).
- [x] Detalhe do ponto busca por ID na API e exibe "Ponto não encontrado" para 404.
- [x] Ponto de destino no cadastro de doações passa a usar os pontos obtidos da API.
- [x] Tratamento de erro com mensagem amigável e botão de tentar novamente caso a API esteja offline.
- [x] Persistência, validação, filtros por tipo, totais e edição/exclusão mantidos em perfeito funcionamento.
