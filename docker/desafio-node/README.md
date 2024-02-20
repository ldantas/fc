# Desafio nginx-node - FullCycle

O projeto foi elaborado para efetuar a execução de uma chamada através do nginx como proxy reverso, um endpoint node que devolve a mensagem "Full Cycle Rocks!" e uma lista de nomes, que estará armazenado de forma persistente em uma instancia do mysql.

Para cumprir o desafio foi utilizado:
 - Criação de network no modo bridge, declarado no docker-compose.yaml
 - Criação de um volume persistente padrão do docker, declarado no docker-compose.yaml
 - MySQL:
    - Instancia do MySQL utilizando imagem padrão
    - Heath check, volume e network declarados no docker-compose.yaml
 - App node:
    - A cada nova inicialização:
        - Verifica se já existe a tabela PESSOA no MySQL. Se não houver, cria.
        - Insere o nome Le Dantas x na tabela pessoa, onde 'x' são quantas linhas estao presentes na tabela.
        - As inserções são acumulativos até o volume do mysql ser removido ou a tabela limpa manualmente. 
    - Imagem customizada node:
        - Dockerfile no diretório ./node
        - instalação do curl para fazer o health_check (verifica se o serviço na porta 3000 está responsivo)
        - inclusão dos arquivos do app
    - Health check no docker-compose.yaml
    - Dependencia do mysql
 - Nginx:
    - Imagem customizada:
        - Dockerfile no diretório ./nginx
        - cópia do arquivo default.conf com as configurações para acessar o app node
    - Dependencia do serviço node


Baixando todo o projeto, é possível executar diretamente no docker compose.
Na primeira execução, será efetuado o build das imagens automaticamente.   
```
docker-compose up -d 
```
