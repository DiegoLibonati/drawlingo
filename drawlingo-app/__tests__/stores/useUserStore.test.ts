import { setActivePinia, createPinia } from "pinia";

import type { User } from "@/types/app";

import { useUserStore } from "@/stores/useUserStore";

describe("useUserStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
  });

  describe("state", () => {
    it("should have empty id initially", () => {
      const store = useUserStore();

      expect(store.id).toBe("");
    });

    it("should have empty username initially", () => {
      const store = useUserStore();

      expect(store.username).toBe("");
    });

    it("should have empty actualRoom initially", () => {
      const store = useUserStore();

      expect(store.actualRoom).toBe("");
    });
  });

  describe("getters", () => {
    it("should return user object with all fields", () => {
      const store = useUserStore();
      store.login({ id: "u1", username: "testuser", actualRoom: "room1" });

      const user = store.user;

      expect(user).toEqual({ id: "u1", username: "testuser", actualRoom: "room1" });
    });

    it("should return user object with empty fields when state is initial", () => {
      const store = useUserStore();

      const user = store.user;

      expect(user).toEqual({ id: "", username: "", actualRoom: "" });
    });
  });

  describe("actions", () => {
    it("should set user state with login", () => {
      const store = useUserStore();
      const user: User = { id: "u1", username: "player1", actualRoom: "lobby_room" };

      store.login(user);

      expect(store.id).toBe("u1");
      expect(store.username).toBe("player1");
      expect(store.actualRoom).toBe("lobby_room");
    });

    it("should update actualRoom with updateUserRoom", () => {
      const store = useUserStore();
      store.login({ id: "u1", username: "player1", actualRoom: "lobby_room" });

      store.updateUserRoom("room1");

      expect(store.actualRoom).toBe("room1");
    });

    it("should persist to sessionStorage when all fields are present after updateUserRoom", () => {
      const store = useUserStore();
      store.login({ id: "u1", username: "player1", actualRoom: "lobby_room" });

      store.updateUserRoom("room1");

      const stored = sessionStorage.getItem("user");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.id).toBe("u1");
      expect(parsed.username).toBe("player1");
      expect(parsed.actualRoom).toBe("room1");
    });

    it("should not persist to sessionStorage when id is empty", () => {
      const store = useUserStore();
      store.login({ id: "", username: "player1", actualRoom: "lobby_room" });

      store.updateUserRoom("room1");

      expect(sessionStorage.getItem("user")).toBeNull();
    });

    it("should not persist to sessionStorage when username is empty", () => {
      const store = useUserStore();
      store.login({ id: "u1", username: "", actualRoom: "lobby_room" });

      store.updateUserRoom("room1");

      expect(sessionStorage.getItem("user")).toBeNull();
    });

    it("should not persist to sessionStorage when actualRoom is empty", () => {
      const store = useUserStore();
      store.login({ id: "u1", username: "player1", actualRoom: "lobby_room" });

      store.updateUserRoom("");

      expect(sessionStorage.getItem("user")).toBeNull();
    });
  });
});
