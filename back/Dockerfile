FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R node:node /app

EXPOSE 3333
USER node

CMD ["npm", "run", "dev"]
