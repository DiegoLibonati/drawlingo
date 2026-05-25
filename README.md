# Drawlingo

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Drawlingo** is a real-time multiplayer drawing and guessing game inspired by Pictionary and Pinturillo. Players connect through WebSockets, enter a username, and land in a global lobby where they can see available rooms, chat with other online players, and either create a new game room or join an existing one.

When creating a room, the host configures the game parameters: room name, visibility (public or private with password protection), player capacity (6 or 8 slots), number of rounds (1 to 3), and countdown duration per turn (10 to 90 seconds in increments of 10). Public rooms appear in the lobby for anyone to join, while private rooms require a password. Once enough players have gathered in the room lobby, the host starts the game.

At the beginning of each turn, one player is designated as the painter and is presented with four randomly selected words to choose from. Once a word is chosen, all other players see a placeholder made of underscores representing the hidden word's letters. The painter then draws on a shared canvas using configurable brush colors and sizes, with every stroke broadcast in real time to all players in the room. The remaining players attempt to guess the word by typing messages in the game chat. When a player's message matches the word (case-insensitive), they are marked as having guessed correctly and earn points based on the formula `ceil((wordLength × remainingSeconds) / 1.2)`, which rewards both speed and longer, more difficult words. To prevent rounds from stalling, a random unrevealed letter is progressively revealed at 15-second intervals as a hint. If all players guess the word before time runs out, the countdown ends immediately and the turn moves on.

After each turn, the painter role rotates to the next player who hasn't painted yet in the current round. Once every player has had a turn painting, the round ends. This cycle repeats for the configured number of rounds. Throughout the game, scores accumulate across all turns and rounds. When the final round concludes, all players are redirected to a score screen that displays the final rankings sorted by total points.

The application also handles disconnections gracefully: if the room owner disconnects, the entire room is closed and all players are notified; if a regular player disconnects, the game continues as long as at least two players remain, otherwise the room is closed. All game state—users, rooms, and lobby data—is stored in Redis as ephemeral session data, with no persistent database, keeping the architecture lightweight and suited for its educational purpose.

## Technologies Used

Frontend:

1. Vue 3
2. TypeScript
3. Vite
4. TailwindCSS
5. HTML5
6. CSS3

Backend:

1. Node.js
2. Express
3. Socket.IO
4. TypeScript

Deploy:

1. Docker
2. Nginx

Database (ephemeral):

1. Redis

## Libraries Used

### Frontend

#### Dependencies

```
"oh-vue-icons": "^1.0.0-rc3"
"pinia": "^2.1.7"
"socket.io-client": "^4.7.5"
"vue": "^3.4.29"
"vue-router": "^4.5.1"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@pinia/testing": "^0.1.7"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@testing-library/vue": "^8.1.0"
"@types/node": "^22.0.0"
"@vitejs/plugin-vue": "^6.0.0"
"@vue/test-utils": "^2.4.6"
"autoprefixer": "^10.5.0"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-vue": "^9.32.0"
"globals": "^15.0.0"
"jsdom": "^26.1.0"
"lint-staged": "^15.0.0"
"msw": "2.10.4"
"prettier": "^3.0.0"
"tailwindcss": "^3.4.1"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"undici": "^7.25.0"
"vite": "^7.1.6"
"vitest": "^3.2.0"
"vue-eslint-parser": "^9.4.3"
"vue-tsc": "^2.2.0"
```

### Backend

#### Dependencies

```
"express": "^4.21.0"
"express-rate-limit": "^8.5.2"
"helmet": "^8.1.0"
"pino": "^10.3.1"
"pino-http": "^11.0.0"
"redis": "^4.6.14"
"socket.io": "^4.8.1"
"uuid": "^14.0.0"
"zod": "^4.4.3"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"@types/uuid": "^10.0.0"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"pino-pretty": "^13.1.3"
"prettier": "^3.0.0"
"socket.io-client": "^4.8.3"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

1. Clone the repository:

```bash
git clone "repository link"
```

2. Install dependencies in both modules:

```bash
cd drawlingo-api && npm install
cd ../drawlingo-app && npm install
```

3. Create the `.env` files by copying the examples provided in each module:

```bash
cp drawlingo-api/.env.example drawlingo-api/.env
cp drawlingo-app/.env.example drawlingo-app/.env
```

4. Build the Docker containers:

```bash
docker-compose -f dev.docker-compose.yml build --no-cache
```

5. Start the application:

```bash
docker-compose -f dev.docker-compose.yml up --force-recreate
```

> **Note:** You need [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed if you are on Windows, and you must run the `docker-compose` commands from the repository root (where `dev.docker-compose.yml` lives).

### Pre-Commit for Development

The repository includes a custom Git hook at `.githooks/pre-commit` that runs **lint-staged** on each module whenever you commit files belonging to that module. The hook path is configured automatically when you run `npm install` inside `drawlingo-app` (via the `prepare` script), so no extra setup is required.

What the hook does on every commit:

- **drawlingo-api** staged files → ESLint fix + Prettier format (`.ts`, `.json`, `.md`)
- **drawlingo-app** staged files → ESLint fix + Prettier format (`.ts`, `.vue`, `.css`, `.json`, `.md`)

## Env Keys

Both modules rely on environment variables loaded from `.env` files. Use the `.env.example` in each module as a starting point.

### Frontend (`drawlingo-app/.env`)

| Key            | Description                                   | Default                 |
| -------------- | --------------------------------------------- | ----------------------- |
| `VITE_API_URL` | URL of the backend API the client connects to | `http://localhost:5050` |

### Backend (`drawlingo-api/.env`)

| Key                    | Description                                                                   | Default                 |
| ---------------------- | ----------------------------------------------------------------------------- | ----------------------- |
| `PORT`                 | Port the Express server listens on                                            | `5050`                  |
| `NODE_ENV`             | Environment identifier (`development`, `production`)                          | `development`           |
| `BASE_URL`             | Public URL where the API is hosted (used for CORS/links)                      | _(empty)_               |
| `CLIENT_URL`           | URL of the frontend application (used for CORS)                               | `http://localhost:3000` |
| `SEED_DEFAULT_DATA`    | Whether to seed default data on startup                                       | `false`                 |
| `LOG_LEVEL`            | Pino log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent`) | `info`                  |
| `RATE_LIMIT_WINDOW_MS` | Rate-limiter time window in milliseconds                                      | `900000`                |
| `RATE_LIMIT_MAX`       | Max requests per window (`0` disables limiting)                               | `0`                     |
| `BODY_LIMIT`           | Maximum JSON/urlencoded body size (e.g. `100kb`, `1mb`)                       | `1gb`                   |
| `REDIS_HOST`           | Hostname of the Redis instance                                                | `redis`                 |
| `REDIS_PORT`           | Port of the Redis instance                                                    | `6379`                  |
| `CHOKIDAR_USEPOLLING`  | Enable filesystem polling for hot-reload inside Docker                        | `true`                  |
| `CHOKIDAR_INTERVAL`    | Polling interval in milliseconds                                              | `100`                   |

## Testing

To run both test suites in parallel from the repository root:

```bash
./run-tests.sh
```

You can also run each suite individually:

### Frontend

```bash
cd drawlingo-app
npm test
```

Runs the Vitest test suite (`vitest run`). Additional commands:

- `npm run test:watch` — re-runs tests on file changes
- `npm run test:coverage` — generates a coverage report

### Backend

```bash
cd drawlingo-api
npm test
```

Runs the Jest test suite (`jest --runInBand --verbose`). Additional commands:

- `npm run test:watch` — re-runs tests on file changes
- `npm run test:coverage` — generates a coverage report

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch.

### Pipeline overview

Both modules are validated independently in parallel, then Docker images are built as a final gate.

```
                   ┌───── PR or push to main ─────┐
                   ▼                               ▼
    ┌────────────────────────┐      ┌────────────────────────┐
    │   api-lint-and-audit   │      │   app-lint-and-audit   │
    │ eslint · prettier ·    │      │ eslint · prettier ·    │
    │ type-check · npm audit │      │ type-check · npm audit │
    └───────────┬────────────┘      └───────────┬────────────┘
                ▼                                ▼
    ┌────────────────────────┐      ┌────────────────────────┐
    │        api-test        │      │        app-test        │
    │    jest + redis 7.0    │      │         vitest         │
    └───────────┬────────────┘      └───────────┬────────────┘
                ▼                                ▼
    ┌────────────────────────┐      ┌────────────────────────┐
    │       api-build        │      │       app-build        │
    │    tsc + tsc-alias     │      │   vue-tsc + vite build │
    └───────────┬────────────┘      └───────────┬────────────┘
                └────────────┬──────────────────┘
                             ▼
               ┌────────────────────────┐
               │      docker-build     │
               │    4-image matrix:     │
               │  api:dev  ·  api:prod  │
               │  app:dev  ·  app:prod  │
               └────────────────────────┘
```

### Jobs

1. **`api-lint-and-audit`** / **`app-lint-and-audit`** — runs `eslint`, `prettier --check`, TypeScript `type-check`, and `npm audit --audit-level=high` (audit is non-blocking).
2. **`api-test`** — installs a Redis 7.0 service container and runs `jest --runInBand --verbose`.
3. **`app-test`** — runs `vitest run`.
4. **`api-build`** / **`app-build`** — verifies the production build succeeds (`tsc + tsc-alias` for the API, `vue-tsc + vite build` for the App).
5. **`docker-build`** — builds all four Docker images (`Dockerfile.development` + `Dockerfile.production` for each module) using a matrix strategy with `fail-fast: false`. Images are built but not pushed.

### Running the same checks locally

```bash
# API — lint, format, type-check, test, build
cd drawlingo-api
npm run lint
npm run format:check
npm run type-check
npm test
npm run build

# App — lint, format, type-check, test, build
cd drawlingo-app
npm run lint
npm run format:check
npm run type-check
npm test
npm run build
```

### Where the outputs live

| Output                               | Location                                                |
| ------------------------------------ | ------------------------------------------------------- |
| Validation logs (lint, tests, build) | **Actions** tab on GitHub                               |
| Docker images                        | Built inside the runner only (not pushed to a registry) |

## Drawlingo Events API

The following section documents every WebSocket event the application uses, intended as a reference for contributors and integrators. Events are split by direction: **Client → Server** (emitted by the frontend) and **Server → Client** (broadcast by the backend).

### Client → Server Events

---

- **Event Name**: CONNECT
- **Event Fn**: Authenticates the user with a username and stores the session in Redis.
- **Event Args**:

```ts
// payload (object)
{
  username: string;
  pathToRedirect: string;
}
```

---

- **Event Name**: DISCONNECT
- **Event Fn**: Disconnects the user from the application and cleans up their session.
- **Event Args**: None (built-in Socket.IO event)

---

- **Event Name**: JOIN_LOBBY
- **Event Fn**: Adds the player to the global lobby where they can see available rooms and chat.
- **Event Args**: None

---

- **Event Name**: LEAVE_LOBBY
- **Event Fn**: Removes the player from the global lobby.
- **Event Args**: None

---

- **Event Name**: SEND_MESSAGE_LOBBY
- **Event Fn**: Sends a chat message to all players in the lobby.
- **Event Args**:

```ts
// raw string parameter
message: string;
```

---

- **Event Name**: CREATE_ROOM
- **Event Fn**: Creates a new game room with the provided configuration.
- **Event Args**:

```ts
// optionsRoom (object)
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
- **Event Fn**: Connects the player to a selected room's waiting lobby.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: LOGIN_PRIVATE_ROOM
- **Event Fn**: Validates the password and connects the player to a private room.
- **Event Args**:

```ts
// payload (object)
{
  idRoom: string;
  password: string;
}
```

---

- **Event Name**: START_GAME
- **Event Fn**: The room owner triggers the start of the game from the room lobby.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: JOIN_GAME
- **Event Fn**: Transitions the player into the active game view and assigns the first painter.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: WORD_SELECTED_GAME
- **Event Fn**: The painter confirms which word they will draw.
- **Event Args**:

```ts
// payload (object)
{
  idRoom: string;
  wordSelected: string;
}
```

---

- **Event Name**: CANVAS_IMAGE_GAME
- **Event Fn**: Sends the current canvas state as a data URL to be broadcast to all players.
- **Event Args**:

```ts
// payload (object)
{
  idRoom: string;
  dataUrl: string;
}
```

---

- **Event Name**: CANVAS_CLEAR_GAME
- **Event Fn**: Clears the canvas board for all players in the room.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: COUNTDOWN_GAME
- **Event Fn**: Decrements the game countdown by one second and broadcasts the updated state.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: SEND_MESSAGE_GAME
- **Event Fn**: Sends a chat message (guess attempt) to all players in the room. If the message matches the word, the player is marked as having guessed correctly and earns points.
- **Event Args**:

```ts
// payload (object)
{
  idRoom: string;
  message: string;
}
```

---

- **Event Name**: NEW_PAINTER_GAME
- **Event Fn**: Rotates the painter role to the next player who hasn't painted yet in the current round.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: NEXT_ROUND_GAME
- **Event Fn**: Advances the game to the next round once all players have painted.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

- **Event Name**: FINISH_GAME
- **Event Fn**: Ends the game session and redirects all players to the score screen.
- **Event Args**:

```ts
// raw string parameter
idRoom: string;
```

---

### Server → Client Events

---

- **Event Name**: DISCONNECT
- **Event Fn**: Notifies a client that they have been forcefully disconnected (e.g. room owner left).
- **Event Payload**:

```ts
reason: string;
```

---

- **Event Name**: UPDATE_LOBBY
- **Event Fn**: Broadcasts the updated lobby state to all players in the lobby (rooms list, online players count).
- **Event Payload**:

```ts
// Lobby object
{
  id: "lobby_room";
  rooms: Record<string, Room>;
  appTotalPlayers: number;
  users: User[];
}
```

---

- **Event Name**: UPDATE_ROOM_LOBBY
- **Event Fn**: Broadcasts the updated room state to all players waiting in a room lobby (player list, configuration).
- **Event Payload**:

```ts
// Room object
room: Room;
```

---

- **Event Name**: UPDATE_GAME
- **Event Fn**: Broadcasts the updated game state to all players in an active game (scores, painter, countdown, word placeholder).
- **Event Payload**:

```ts
// Room object
room: Room;
```

---

- **Event Name**: SEND_MESSAGE_LOBBY
- **Event Fn**: Broadcasts a chat message to all players in the lobby.
- **Event Payload**:

```ts
// Message object
{
  id: string;
  user: User;
  message: string;
}
```

---

- **Event Name**: START_GAME
- **Event Fn**: Notifies all players in the room that the game has started.
- **Event Payload**: None

---

- **Event Name**: CANVAS_IMAGE_GAME
- **Event Fn**: Broadcasts the painter's canvas data URL to all other players in the room.
- **Event Payload**:

```ts
dataUrl: string;
```

---

- **Event Name**: CANVAS_CLEAR_GAME
- **Event Fn**: Notifies all players in the room that the canvas has been cleared.
- **Event Payload**: None

---

- **Event Name**: SEND_MESSAGE_GAME
- **Event Fn**: Broadcasts a chat message to all players in the game room. Includes a `success` flag when the guess was correct.
- **Event Payload**:

```ts
// Message object
{
  id: string;
  user: User;
  message: string;
  success?: boolean;
}
```

---

- **Event Name**: NEW_PAINTER_GAME
- **Event Fn**: Notifies all players that a new painter has been assigned.
- **Event Payload**: None

---

- **Event Name**: NEXT_ROUND_GAME
- **Event Fn**: Notifies all players that a new round has started.
- **Event Payload**: None

---

- **Event Name**: FINISH_GAME
- **Event Fn**: Notifies all players that the game has ended and they should navigate to the score screen.
- **Event Payload**: None

---

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/drawlingo`](https://www.diegolibonati.com.ar/#/project/drawlingo)
