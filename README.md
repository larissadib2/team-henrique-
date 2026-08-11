# Team Henrique

App para gerenciar aulas de beach tennis — login do professor, cadastro de
alunos e turmas, agenda com controle de presença e controle financeiro das
mensalidades.

## Stack

- [Expo](https://expo.dev) + React Native (SDK 57) com TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação por arquivos
- `@react-native-async-storage/async-storage` para persistência local dos dados

## Funcionalidades

- **Login do professor** — cadastro obrigatório (e-mail/senha) na primeira vez que o app
  é aberto; sem conta, o acesso ao restante do app fica bloqueado
- **Alunos** — cadastro, edição e exclusão, com vínculo a turmas e valor de mensalidade
- **Turmas** — cadastro com dias da semana, horário e valor de mensalidade
- **Agenda** — mostra as turmas com aula no dia e permite fazer a chamada
- **Presença** — controle de presença por turma e por data
- **Financeiro** — geração das mensalidades do mês, acompanhamento de valores
  previstos/recebidos/pendentes e marcação de pagamento por aluno

## Rodando o projeto

```bash
npm install
npm run start   # abre o Metro/Expo Dev Tools
npm run web     # roda no navegador
npm run android # roda em emulador/dispositivo Android
npm run ios     # roda em simulador/dispositivo iOS
```

Os dados ficam salvos localmente no dispositivo (AsyncStorage) — não há
backend nesta primeira versão. O login do professor também é local: a senha é
armazenada com hash (SHA-256), mas não há sincronização entre aparelhos nem
recuperação de senha por e-mail.
