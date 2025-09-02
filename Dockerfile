FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/build ./build

COPY package*.json ./

RUN npm install -g serve

EXPOSE 3000

CMD ["sh", "-c", "REACT_APP_SOME_VAR=value serve -s build -l 3000"]
