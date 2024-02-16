# Desafio GO - FullCycle

Imagem disponível no (Docker Hub)[https://hub.docker.com/r/ledantas/fullcycle]

## Criar a imagem com o codigo fonte no host, compilador no container
```
docker run --rm -it -v $(pwd):/go/src golang:latest bash 
```
### dentro do container
```
cd $GOPATH/src/
go build fc-rocks.go 
```

### para executar no container
```
./fc-rocks
```

## para gerar a imagem
```
docker build -t ledantas/fullcycle:latest .
```

## executar
```
docker run ledantas/fullcycle
```

## push para o dockerhub
```
docker push ledantas/fullcycle:latest
```
