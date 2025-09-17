# 1. Imagem Base: Começamos com uma imagem oficial do Node.js.
# Usamos a versão 18, conforme especificado no seu package.json.
# A tag "-alpine" usa uma versão mais leve do Linux, resultando em uma imagem final menor.
FROM node:18-alpine

# 2. Diretório de Trabalho: Criamos e definimos o diretório de trabalho dentro do container.
# Todos os comandos a seguir serão executados a partir daqui.
WORKDIR /app

# 3. Copiar Dependências: Copiamos os arquivos de manifesto de pacotes.
# O '*' garante que tanto o package.json quanto o package-lock.json sejam copiados.
COPY package*.json ./

# 4. Instalar Dependências: Executamos o npm install.
# O Docker é inteligente: ele só executará este passo novamente se os arquivos package*.json mudarem.
# Isso acelera muito as builds futuras se você só alterar o código-fonte.
RUN npm install

# 5. Copiar o Código-Fonte: Agora, copiamos todo o resto do código do seu projeto para o container.
# O arquivo .dockerignore (que criaremos a seguir) controlará o que não deve ser copiado.
COPY . .

# 6. Expor a Porta: Informamos ao Docker que o container escutará na porta 3000.
# Seu server.js usa process.env.PORT || 3000, então 3000 é a porta padrão.
EXPOSE 3000

# 7. Comando de Inicialização: Este é o comando que será executado quando o container iniciar.
# Ele inicia sua aplicação da mesma forma que você faz localmente.
CMD [ "node", "--dns-result-order=ipv4first", "server.js" ]