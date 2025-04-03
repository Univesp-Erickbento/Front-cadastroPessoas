#!/bin/bash

# Variáveis de configuração
SERVICE_NAME="bmt-web"
DOCKER_NETWORK="bmt-rede-docker"  # Certificando que o nome da rede está correto (minúsculo)
CONTAINER_IP="172.18.0.5" # Definindo o IP fixo

# Passo 1: Rodar o build da aplicação Angular (assegure-se de estar no diretório do projeto)
echo "Rodando o build da aplicação Angular..."
ng build --configuration production

# Passo 2: Obter a versão do package.json
VERSION=$(cat package.json | jq -r .version)

# Passo 3: Parar o container atual
echo "Parando o container $SERVICE_NAME..."
docker stop $SERVICE_NAME || true  # Ignorar erro caso o container não exista

# Passo 4: Remover o container atual
echo "Removendo o container $SERVICE_NAME..."
docker rm $SERVICE_NAME || true  # Ignorar erro caso o container não exista

# Passo 5: Remover a imagem antiga
echo "Removendo a imagem antiga $SERVICE_NAME..."
docker rmi $SERVICE_NAME:$VERSION || true  # Ignorar erro caso o container não exista

# Passo 6: Construir a nova imagem com a versão do package.json
echo "Construindo a nova imagem $SERVICE_NAME:$VERSION..."
docker build -t $SERVICE_NAME:$VERSION .

# Passo 7: Verificar se a rede Docker existe
echo "Verificando se a rede Docker $DOCKER_NETWORK existe..."
docker network inspect $DOCKER_NETWORK > /dev/null 2>&1

# Se a rede não existir, cria a rede
if [ $? -ne 0 ]; then
    echo "A rede $DOCKER_NETWORK não existe. Criando a rede..."
    docker network create $DOCKER_NETWORK
fi

# Passo 8: Rodar o novo container com a nova imagem e o IP fixo
echo "Criando e iniciando o container $SERVICE_NAME com IP fixo $CONTAINER_IP..."
docker run -d --name $SERVICE_NAME -p 4200:80 --network $DOCKER_NETWORK --ip $CONTAINER_IP $SERVICE_NAME:$VERSION


# Passo 9: Verificar se o container está rodando
echo "Verificando se o container está rodando..."
docker ps | grep $SERVICE_NAME

echo "Deploy concluído com sucesso!"
