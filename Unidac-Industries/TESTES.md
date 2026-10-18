# Testes — Unidac Industries

## Como usar

1. Publique o site (GitHub Pages) ou abra com um servidor local.
2. Acesse **`testes.html`** (ex.: `https://seu-usuario.github.io/seu-repo/testes.html`).
3. Clique em **Rodar testes automáticos**.
4. Faça login com cada cargo e complete o **checklist manual**.
5. Use **Exportar resultado** para salvar um `.txt`.

## O que a página cobre

- Presença do Firebase, funções de menu por cargo (`ROLE_PAGES`), sessão
- Leitura no Firestore (com usuário logado) e avisos de Rules
- Checklist manual: admin, estoquista, cozinheira, financeiro, gerente, aluno, professor, funcionário
- Itens gerais (Rules, mobile, loop no Pages)

## Observação

Testes de **gravação** (botões Salvar) são manuais de propósito: validam o fluxo real na interface.
