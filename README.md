# 📚 Biblioteca Ativa

## Sobre o Projeto

**Biblioteca Ativa** é um sistema de gerenciamento de biblioteca desenvolvido como Trabalho de Conclusão de Curso (TCC) para a ETEC Bartolomeu Bueno da Silva Anhanguera. A plataforma oferece uma solução completa e moderna para a administração do acervo, empréstimos e interações dos usuários com a biblioteca da instituição.

O sistema foi projetado para ser intuitivo e eficiente, atendendo às necessidades tanto dos alunos quanto dos administradores da biblioteca, com perfis de acesso e funcionalidades distintas para cada um.

## 👨‍💻 Equipe

  * Isaac Amorim
  * Enrico Hidalgo
  * Guilherme Caetano

## ✨ Funcionalidades Principais

O sistema é dividido em dois níveis de acesso principais: **Aluno** e **Administrador**.

### Para Alunos:

  * **Autenticação Segura:** Cadastro restrito a e-mails institucionais (`@etec.sp.gov.br`) e login seguro.
  * **Catálogo de Livros:** Explore o acervo completo da biblioteca com um sistema de busca por título, autor ou categoria.
  * **Detalhes do Livro:** Veja informações completas, como sinopse, ano de publicação, disponibilidade e capa.
  * **Solicitação de Empréstimos:** Solicite o empréstimo de livros disponíveis diretamente pela plataforma.
  * **Perfil de Usuário:** Gerencie suas informações pessoais, visualize seu histórico de empréstimos (ativos e devolvidos) e sua lista de livros favoritos.
  * **Interatividade:** Favorite livros, deixe comentários e avalie as obras com um sistema de 1 a 5 estrelas.

### Para Administradores:

  * **Dashboard de Empréstimos:** Um painel central para gerenciar todas as solicitações de empréstimo pendentes e livros atualmente emprestados.
  * **Gestão de Empréstimos:** Confirme solicitações, registre devoluções e cancele pedidos.
  * **Gerenciamento de Acervo:** Adicione, edite e remova livros do sistema.
  * **Publicação de Conteúdo:** Os livros adicionados ficam primeiro em um "Acervo" privado, permitindo que o administrador revise as informações antes de publicá-los no catálogo principal.
  * **Busca de Capas Online:** Ferramenta integrada com a API do Google Books para buscar e adicionar capas de livros de forma automática.
  * **Moderação de Conteúdo:** Remova comentários inadequados feitos por usuários.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna e robusta, utilizando as seguintes tecnologias:

  * **Backend:** Node.js, Express.js
  * **Banco de Dados:** PostgreSQL com Sequelize ORM
  * **Frontend:** EJS (Embedded JavaScript templates) para renderização no servidor, CSS3 e JavaScript.
  * **Autenticação:** Gerenciamento de sessões e estratégias de login com Passport.js.
  * **Deployment:** O projeto está configurado para deploy com Docker e possui arquivos de configuração para a Vercel.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

  * [Node.js](https://nodejs.org/) (versão 18 ou superior)
  * [PostgreSQL](https://www.postgresql.org/)
  * [Git](https://git-scm.com/)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/isaacamorimm/BibliotecaAtiva-TCC2025.git
    cd BibliotecaAtiva-TCC2025
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

      * Crie um arquivo `.env` na raiz do projeto, baseado no exemplo `.env.example` (se houver) ou com as seguintes variáveis:

    <!-- end list -->

    ```env
    DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
    SESSION_SECRET="sua_chave_secreta_aqui"
    GOOGLE_BOOKS_API_KEY="sua_api_key_do_google_books"
    ```

4.  **Inicie o servidor:**

    ```bash
    npm run dev
    # ou
    npm start
    ```

5.  Acesse `http://localhost:3000` em seu navegador.

## 📂 Estrutura do Projeto

O repositório está organizado da seguinte forma:

```
/
├── public/                # Arquivos estáticos (CSS, JS, imagens)
├── src/
│   ├── config/            # Configuração do banco de dados
│   ├── controllers/       # Lógica de controle (solicitações e respostas)
│   ├── middlewares/       # Middlewares de autenticação e autorização
│   ├── models/            # Definições dos modelos do Sequelize
│   ├── repositories/      # Camada de acesso aos dados do banco
│   ├── routes/            # Definição das rotas da aplicação
│   └── views/             # Arquivos EJS (templates do frontend)
├── .dockerignore
├── .gitignore
├── Dockerfile             # Configuração para containerização
├── app.js                 # Ponto de entrada da aplicação Express
├── package.json
└── server.js              # Script para iniciar o servidor
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
