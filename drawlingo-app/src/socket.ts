import { io } from "socket.io-client";

import { useSessionStorage } from "@/composables/useSessionStorage";

const URL = import.meta.env.VITE_API_URL;

const socket = io(URL, {
  autoConnect: false,
});

socket.on("disconnect", () => {
  const { handleGetItem, handleRemoveItem } = useSessionStorage();

  const player = handleGetItem("player");

  if (player) {
    handleRemoveItem("player");
  }
});

export default socket;
