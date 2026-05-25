import type { Lobby, Rooms, Users } from "@/types/app";

export const idLobby = "lobby_room";

export const WORDS = [
  "ARBOL",
  "CAMINO",
  "SUEÑO",
  "ESPERANZA",
  "RELOJ",
  "MONTAÑA",
  "MARIPOSA",
  "CUENTO",
  "ESTRELLA",
  "NUBE",
];

export const INITIAL_USERS: Users = {};
export const INITIAL_ROOMS: Rooms = {};
export const INITIAL_LOBBY: Lobby = {
  id: idLobby,
  appTotalPlayers: Object.keys(INITIAL_USERS).length,
  users: [],
  rooms: INITIAL_ROOMS,
};
