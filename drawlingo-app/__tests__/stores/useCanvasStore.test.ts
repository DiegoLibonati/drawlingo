import { setActivePinia, createPinia } from "pinia";

import { useCanvasStore } from "@/stores/useCanvasStore";

describe("useCanvasStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("state", () => {
    it("should have canDraw as false initially", () => {
      const store = useCanvasStore();

      expect(store.canDraw).toBe(false);
    });

    it("should have pos as { x: 0, y: 0 } initially", () => {
      const store = useCanvasStore();

      expect(store.pos).toEqual({ x: 0, y: 0 });
    });

    it("should have color as #000 initially", () => {
      const store = useCanvasStore();

      expect(store.color).toBe("#000");
    });

    it("should have size as 0.1 initially", () => {
      const store = useCanvasStore();

      expect(store.size).toBe(0.1);
    });

    it("should have canvas as null initially", () => {
      const store = useCanvasStore();

      expect(store.canvas).toBeNull();
    });
  });

  describe("actions", () => {
    it("should set size with setSize", () => {
      const store = useCanvasStore();

      store.setSize(5);

      expect(store.size).toBe(5);
    });

    it("should set color with setColor", () => {
      const store = useCanvasStore();

      store.setColor("#ff0000");

      expect(store.color).toBe("#ff0000");
    });

    it("should set canDraw with setCanDraw", () => {
      const store = useCanvasStore();

      store.setCanDraw(true);

      expect(store.canDraw).toBe(true);
    });

    it("should set pos with setPos", () => {
      const store = useCanvasStore();

      store.setPos({ x: 10, y: 20 });

      expect(store.pos).toEqual({ x: 10, y: 20 });
    });

    it("should set canvas with setCanvas", () => {
      const store = useCanvasStore();
      const canvas = document.createElement("canvas");

      store.setCanvas(canvas);

      expect(store.canvas).toBe(canvas);
    });
  });

  describe("getters", () => {
    it("should throw error for canvasContext when canvas is null", () => {
      const store = useCanvasStore();

      expect(() => store.canvasContext).toThrow("Canvas not initialized");
    });

    it("should throw error for canvasRect when canvas is null", () => {
      const store = useCanvasStore();

      expect(() => store.canvasRect).toThrow("Canvas not initialized");
    });

    it("should throw error for canvasDataUrl when canvas is null", () => {
      const store = useCanvasStore();

      expect(() => store.canvasDataUrl).toThrow("Canvas not initialized");
    });

    it("should throw error for canvasSizes when canvas is null", () => {
      const store = useCanvasStore();

      expect(() => store.canvasSizes).toThrow("Canvas not initialized");
    });

    it("should not throw when accessing canvasContext with a canvas set", () => {
      const store = useCanvasStore();
      const canvas = document.createElement("canvas");
      canvas.getContext = vi.fn().mockReturnValue({ beginPath: vi.fn() });
      store.setCanvas(canvas);

      expect(() => store.canvasContext).not.toThrow();
    });

    it("should return canvas bounding client rect when canvas is set", () => {
      const store = useCanvasStore();
      const canvas = document.createElement("canvas");
      store.setCanvas(canvas);

      const rect = store.canvasRect;

      expect(rect).toBeDefined();
      expect(rect).toHaveProperty("x");
      expect(rect).toHaveProperty("y");
      expect(rect).toHaveProperty("width");
      expect(rect).toHaveProperty("height");
    });

    it("should not throw when accessing canvasDataUrl with a canvas set", () => {
      const store = useCanvasStore();
      const canvas = document.createElement("canvas");
      canvas.toDataURL = vi.fn().mockReturnValue("data:image/png;base64,stub");
      store.setCanvas(canvas);

      expect(() => store.canvasDataUrl).not.toThrow();
    });

    it("should return canvas sizes when canvas is set", () => {
      const store = useCanvasStore();
      const canvas = document.createElement("canvas");
      store.setCanvas(canvas);

      const sizes = store.canvasSizes;

      expect(sizes).toHaveProperty("height");
      expect(sizes).toHaveProperty("width");
    });
  });
});
