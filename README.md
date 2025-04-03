# Cached Image Upload

Este projeto é um serviço em Node.js/TypeScript para upload, processamento e cache de imagens.  
O projeto permite fazer upload de imagens (com tamanho máximo configurado), renomear processar(redimensionamento e compressão via Sharp) e armazenar localmente ou em no S3. Além disso, a aplicação utiliza cache (com Node-Cache) para acelerar o acesso às imagens. Infra estrutura com docker e workflow para git.  
Obs. No teste foi solicitado um retorno 204(no content) para sucesso no upload porem optei por retornar 200 e um body com o nome da imagem renomeado utilizado uuid garantindo um nome único no storage.

## Melhorias futuras

Migrar o cache para algum serviço e implementar clustering

## Funcionalidades

- Endpoint `POST /upload/image` que aceita imagens via multipart/form-data com um tamanho máximo (ex.: 5 MB).
- Endpoint `GET /health` para monitorar o status da aplicação (retorna status, uptime e timestamp).
- Endpoint `GET /static/image/:filename` para servir as imagens armazenadas.

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **TypeScript**
- **Multer** para upload de arquivos
- **Sharp** para processamento de imagens
- **Node-Cache** para caching
- **AWS SDK v3** para integração com S3 com Minio
- **Jest** com **ts-jest** para testes

## Estrutura do Projeto

```plaintext
cached-image-upload/
├── src/
│   ├── config/
│   │   ├── index.ts         # Configurações da aplicação
│   │   └── server.ts        # Inicialização do servidor Express
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   └── image.controller.ts
│   ├── middlewares/
│   │   └── upload.middleware.ts
│   ├── routes/
│   │   ├── health.routes.ts
│   │   └── image.routes.ts
│   └── services/
│       ├── image.service.ts
│       └── cache.service.ts
├── tests/
│   ├── unit/                # Testes unitários
│   └── integration/         # Testes de integração
├── package.json
├── tsconfig.json
└── README.md
```

## Configuração

Crie um arquivo `.env` na raiz do projeto seguindo o arquivo .env de exemplo

## Instalação

```bash
git clone https://github.com/MoisesAlvesCostaDev/cached-image-upload.git
cd cached-image-upload
npm install
```

Se preferir utilizar s3 e subir apenas Minio

```bash
docker-compose up -d minio
```

## Desenvolvimento

```bash
npm run dev
```

ou

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Testes

```bash
npm run test:unit           # Testes unitários
npm run test:integration    # Testes de integração
```

## Docker build

```bash
docker-compose build
docker-compose up -d
```
