import { setActivePinia, createPinia } from "pinia";

import { useAlertStore } from "@/stores/useAlertStore";

describe("useAlertStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("state", () => {
    it("should have empty type as initial state", () => {
      const store = useAlertStore();

      expect(store.type).toBe("");
    });

    it("should have empty message as initial state", () => {
      const store = useAlertStore();

      expect(store.message).toBe("");
    });
  });

  describe("getters", () => {
    it("should return false for isOpen when message is empty", () => {
      const store = useAlertStore();

      expect(store.isOpen).toBe(false);
    });

    it("should return true for isOpen when message is set", () => {
      const store = useAlertStore();

      store.message = "Something went wrong";

      expect(store.isOpen).toBe(true);
    });

    it("should return description with first letter capitalized", () => {
      const store = useAlertStore();

      store.type = "error";

      expect(store.description).toBe("Error");
    });

    it("should return description with first letter capitalized for warning", () => {
      const store = useAlertStore();

      store.type = "warning";

      expect(store.description).toBe("Warning");
    });

    it("should return description with first letter capitalized for info", () => {
      const store = useAlertStore();

      store.type = "info";

      expect(store.description).toBe("Info");
    });

    it("should return empty string for description when type is empty", () => {
      const store = useAlertStore();

      expect(store.description).toBe("");
    });
  });

  describe("actions", () => {
    it("should set alert state with setAlert", () => {
      const store = useAlertStore();
      const alert = { type: "error" as const, message: "An error occurred" };

      store.setAlert(alert);

      expect(store.type).toBe("error");
      expect(store.message).toBe("An error occurred");
    });

    it("should clear alert state with clearAlert", () => {
      const store = useAlertStore();
      store.setAlert({ type: "warning", message: "Watch out" });

      store.clearAlert();

      expect(store.type).toBe("");
      expect(store.message).toBe("");
    });
  });
});
