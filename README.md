
# Instituto Mão Amiga

Aplicativo mobile desenvolvido em React Native com Expo para cadastro e controle de doações.

## Funcionalidades

- Visualização dos pontos de coleta
- Cadastro de doações
- Histórico de doações
- Filtro por tipo de item
- Resumo dos totais por tipo
- Visualização dos detalhes
- Edição de doações
- Exclusão de doações
- Salvamento das doações no aparelho

## Tecnologias

- React Native
- Expo
- JavaScript
- AsyncStorage

## Como executar

Instale as dependências:

```bash
npm install
````

Inicie o projeto:

```bash
npm start
```

ou:

```bash
npx expo start
```

## Estrutura

```text
src/
├── components/
├── data/
├── screens/
├── storage/
└── styles/
```

## Armazenamento

As doações são salvas usando AsyncStorage.

O acesso às doações fica centralizado no arquivo:

```text
src/storage/doacoesStorage.js
```

## Demonstração

1. Cadastrar uma doação.
2. Abrir o histórico.
3. Filtrar por tipo.
4. Editar uma doação.
5. Excluir uma doação.
6. Fechar e abrir o aplicativo novamente para verificar a persistência dos dados.

## Projeto

Projeto desenvolvido para o Instituto Mão Amiga como atividade acadêmica.
