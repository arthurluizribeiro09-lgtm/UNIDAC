# Unidac Industries

Estrutura profissional simplificada:

```
/
  index.html          # Login
  dashboard.html      # Painel
  *.html              # Demais páginas
  css/                # Todos os estilos
  js/                 # Todos os scripts
```

Login redireciona para `dashboard.html`.
Páginas exclusivas: `usuarios.html`, `inteligente.html` (admin), `ficha.html` (aluno).


## Segurança (Firestore Rules)

1. Abra o [Firebase Console](https://console.firebase.google.com) → projeto **unidac-industries**.
2. **Firestore Database** → aba **Regras**.
3. Cole o conteúdo do arquivo `firestore.rules` deste projeto.
4. Clique em **Publicar**.

Importante:
- Cada login grava/atualiza `users/{uid}` com o campo `role`.
- Novos usuários criados pelo admin usam o **mesmo uid** do Authentication como ID do documento.
- Se um usuário antigo não entrar em alguma tela após publicar as regras, peça para **sair e entrar de novo** (sincroniza o perfil por uid).
