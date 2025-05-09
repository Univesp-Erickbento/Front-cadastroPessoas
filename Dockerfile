# Etapa 1: Construção da aplicação Angular
FROM node:18 AS build

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências da aplicação
RUN npm install

# Copiar o código da aplicação para dentro do contêiner
COPY . .

# Construir a aplicação para produção
RUN npm run build angularproject -- --configuration production

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copiar os arquivos construídos pela etapa anterior para o diretório do Nginx
COPY --from=build /app/dist/angularproject /usr/share/nginx/html

# Expor a porta 4200 (ao invés da 80)
EXPOSE 80

# # Modificar a configuração do Nginx para escutar na porta 4200
# RUN sed -i 's/listen       80;/listen       4200;/' /etc/nginx/conf.d/default.conf

# Iniciar o servidor Nginx para servir os arquivos da aplicação Angular
CMD ["nginx", "-g", "daemon off;"]
