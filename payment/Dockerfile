FROM node:18-bullseye-slim


WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

CMD ["npm","start"]