import { defineStore, acceptHMRUpdate } from "pinia";

import type { Canvas } from "@/types/app";

export const useCanvasStore = defineStore("canvas", {
  state: (): Canvas => ({
    canDraw: false,
    pos: {
      x: 0,
      y: 0,
    },
    color: "#000",
    size: 0.1,
    canvas: null,
  }),
  getters: {
    canvasContext(state): CanvasRenderingContext2D {
      if (!state.canvas) throw new Error("Canvas not initialized");
      return state.canvas.getContext("2d")!;
    },
    canvasRect(state): DOMRect {
      if (!state.canvas) throw new Error("Canvas not initialized");
      return state.canvas.getBoundingClientRect();
    },
    canvasDataUrl(state): string {
      if (!state.canvas) throw new Error("Canvas not initialized");
      return state.canvas.toDataURL();
    },
    canvasSizes(state): { height: number; width: number } {
      if (!state.canvas) throw new Error("Canvas not initialized");
      return {
        height: state.canvas.offsetHeight,
        width: state.canvas.offsetWidth,
      };
    },
  },
  actions: {
    setSize(size: number): void {
      this.size = size;
    },
    setColor(color: string): void {
      this.color = color;
    },
    setCanDraw(canDraw: boolean): void {
      this.canDraw = canDraw;
    },
    setPos(pos: { x: number; y: number }): void {
      this.pos = pos;
    },
    setCanvas(canvas: HTMLCanvasElement): void {
      this.canvas = canvas;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCanvasStore, import.meta.hot));
}
