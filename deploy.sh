#!/bin/bash

# Variáveis de configuração
SERVICE_NAME="bmt-web"
DOCKER_NETWORK="BMT-rede-docker"

# Passo 1: Rodar o build da aplicação Angular (assegure-se de estar no diretório do projeto)
echo "Rodando o build da aplicação Angular..."
ng build --configuration production

# Passo 2: Obter a versão do package.json
VERSION=$(cat package.json | jq -r .version)

# Passo 3: Parar o container atual
echo "Parando o container $SERVICE_NAME..."
docker stop $SERVICE_NAME

# Passo 4: Remover o container atual
echo "Removendo o container $SERVICE_NAME..."
docker rm $SERVICE_NAME

# Passo 5: Remover a imagem antiga
echo "Removendo a imagem antiga $SERVICE_NAME..."
docker rmi $SERVICE_NAME:$VERSION

# Passo 6: Construir a nova imagem com a versão do package.json
echo "Construindo a nova imagem $SERVICE_NAME:$VERSION..."
docker build -t $SERVICE_NAME:$VERSION .

# Passo 7: Rodar o novo container com a nova imagem
echo "Criando e iniciando o container $SERVICE_NAME..."
docker run -d --name $SERVICE_NAME -p 4200:80 --network $DOCKER_NETWORK $SERVICE_NAME:$VERSION

# Passo 8: Verificar se o container está rodando
echo "Verificando se o container está rodando..."
docker ps | grep $SERVICE_NAME

echo "Deploy concluído com sucesso!"
