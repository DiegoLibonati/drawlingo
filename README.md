# Pinturillo Vue NodeJS

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Join to `pinturillo-vue` folder and `pinturillo-api` folder and execute: `npm install` or `yarn install` in the terminal
3. Go to the previous folder and execute: `docker-compose build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `docker-compose.yml` and you need to install `Docker Desktop` if you are in Windows.

## Description

This repository is an application made with vue and socket io. It is a game where one player paints and the others must guess what the other player is painting, based on the game Pinturillo.

## Technologies used

1. NodeJS
2. Typescript
3. VueJS 3
4. Tailwind CSS
5. Docker
6. Redis
7. Socket IO

## Libraries used

### Frontend

#### Dependencies

```
"oh-vue-icons": "^1.0.0-rc3"
"pinia": "^2.1.7"
"socket.io-client": "^4.7.5"
"vue": "^3.4.29"
"vue-router": "^4.4.0"
```

#### devDependencies

```
"@types/jest": "^29.5.14"
"@types/node": "^20.14.8"
"@vitejs/plugin-vue": "^5.0.5"
"@vue/compiler-sfc": "^3.5.13"
"@vue/test-utils": "^2.4.6"
"@vue/vue3-jest": "^29.2.6"
"autoprefixer": "^10.4.19"
"jest": "^29.7.0"
"jest-environment-jsdom": "^29.7.0"
"postcss": "^8.4.38"
"tailwindcss": "^3.4.4"
"ts-jest": "^29.2.5"
"ts-jest-mock-import-meta": "^1.2.1"
"typescript": "^5.2.2"
"vite": "^5.3.1"
"vue-tsc": "^2.0.21"
```

### Backend

#### Dependencies

```
"express": "^4.19.2"
"morgan": "1.10.0"
"redis": "^4.6.14"
"socket.io": "4.7.5"
"uuid": "^10.0.0"
```

#### devDependencies

```
"@types/express": "^4.17.21"
"@types/jest": "^29.5.14"
"@types/morgan": "^1.9.9"
"@types/node": "^20.10.5"
"@types/uuid": "^10.0.0"
"jest": "^29.7.0"
"nodemon": "^3.1.4"
"ts-jest": "^29.2.5"
"ts-node": "^10.9.2"
"tsconfig-paths": "^4.2.0"
"typescript": "^5.2.2"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/Pinturillo-Vue-NodeJS`](https://www.diegolibonati.com.ar/#/project/Pinturillo-Vue-NodeJS)

## Video

https://github.com/user-attachments/assets/85799435-bcea-4f6f-9a45-2db9fb6ea56b

## Testing

### Frontend

1. Join to `pinturillo-vue` folder
2. Execute: `yarn test` or `npm test`

### Backend

1. Join to `pinturillo-api` folder
2. Execute: `yarn test` or `npm test`

## Documentation APP

### **Version**

```ts
APP VERSION: 1.0.0
README UPDATED: 09/01/2025
AUTHOR: Diego Libonati
```

### **Env Keys**

1. `VITE_API_URL`: This is the link to the application if you are in development leave it as localhost
2. `PORT`: It is the application port
3. `CLIENT_URL`: It is the link to the client side application.
4. `REDIS_HOST`: Is the host name to connect to redis
5. `REDIS_PORT`: Is the port to connect to redis

```ts
# Frontend Envs
VITE_API_URL=http://localhost:5000

# Backend Envs
PORT=5000
CLIENT_URL=http://localhost:5173
REDIS_HOST=redis
REDIS_PORT=6379
```

### **Pinturillo Events API**

---

- **Event Name**: CONNECT
- **Event Fn**: This event is in charge of connecting the user where he/she is connected and loading him/her in redis.
- **Event Props**:

```ts
{
  username: string;
  pathToRedirect: string;
}
```

---

- **Event Name**: DISCONNECT
- **Event Fn**: This event disconnects the user from the application.
- **Event Props**: None

---

- **Event Name**: JOIN_GAME
- **Event Fn**: This event is in charge of making players enter the room where they will play, initializing a user to choose a word to paint.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: JOIN_LOBBY
- **Event Fn**: This event is responsible for making players enter the lobby where they can choose a room or chat.
- **Event Props**: None

---

- **Event Name**: LEAVE_LOBBY
- **Event Fn**: This event is responsible for disconnecting users from the lobby.
- **Event Props**: None

---

- **Event Name**: SEND_MESSAGE_LOBBY
- **Event Fn**: This event is responsible for sending a message to all lobby users.
- **Event Props**:

```ts
{
  message: string;
}
```

---

- **Event Name**: CREATE_ROOM
- **Event Fn**: This event is in charge of creating a room based on the options sent by props.
- **Event Props**:

```ts
type TypeRoom = "public" | "private";
type RoundsRoom = 1 | 2 | 3;
type SlotsRoom = 6 | 8;
type CountdownRoom = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

{
  name: string;
  type: TypeRoom;
  password: string;
  slots: SlotsRoom;
  totalRounds: RoundsRoom;
  countdown: CountdownRoom;
}
```

---

- **Event Name**: JOIN_ROOM_LOBBY
- **Event Fn**: This event is responsible for connecting a user to a selected room from the lobby.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: LOGIN_PRIVATE_ROOM
- **Event Fn**: This event is responsible for connecting a user to a private room.
- **Event Props**:

```ts
{
  idRoom: string;
  password: string;
}
```

---

- **Event Name**: START_GAME
- **Event Fn**: This event is responsible for initializing a game room through the lobby of the room itself.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: WORD_SELECTED_GAME
- **Event Fn**: This event is responsible for loading the word selected by the painter in the room where it is being played.
- **Event Props**:

```ts
{
  idRoom: string;
  wordSelected: string;
}
```

---

- **Event Name**: CANVAS_IMAGE_GAME
- **Event Fn**: This event is responsible for updating the canvas board to the players.
- **Event Props**:

```ts
{
  idRoom: string;
  dataUrl: string;
}
```

---

- **Event Name**: CANVAS_CLEAR_GAME
- **Event Fn**: This event is responsible for wiping the canvas board for players
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: COUTNDOWN_GAME
- **Event Fn**: This event is responsible for updating the counter of the game to players
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: SEND_MESSAGE_GAME
- **Event Fn**: This event is responsible for sending a message to the players in a room.
- **Event Props**:

```ts
{
  idRoom: string;
  message: string;
}
```

---

- **Event Name**: NEW_PAINTER_GAME
- **Event Fn**: This event is responsible for loading a new painter from a specific room.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: NEXT_ROUND_GAME
- **Event Fn**: This event is responsible for updating the round of a specific room.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---

- **Event Name**: FINISH_GAME
- **Event Fn**: This event is responsible for ending a specific game.
- **Event Props**:

```ts
{
  idRoom: string;
}
```

---
