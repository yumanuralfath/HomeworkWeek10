FROM node:16-alpine

WORKDIR  /app/backend

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]