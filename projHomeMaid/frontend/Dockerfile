# Fase de build
FROM node:20 AS build-stage

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala apenas as dependências de produção
RUN npm ci --omit=dev

# Copia o código-fonte
COPY . .

# Executa o build
RUN npm run build

# Fase de produção com Nginx
FROM nginx:latest

# Copia o build para o diretório do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
