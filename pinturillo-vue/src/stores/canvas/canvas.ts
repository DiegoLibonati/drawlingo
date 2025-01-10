import { defineStore, acceptHMRUpdate } from "pinia";

import { Canvas } from "@/entities/entities";

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
    canvasContext: (state): CanvasRenderingContext2D => {
      return state.canvas?.getContext("2d")!;
    },
    canvasRect: (state): DOMRect => {
      return state.canvas?.getBoundingClientRect()!;
    },
    canvasDataUrl: (state): string => {
      // TODO: SIENTO QUE SIEMPRE ES EL MISMO Y POR ESO NO PINTA
      console.log(state.canvas?.toDataURL());
      return state.canvas?.toDataURL()!;
    },
    canvasSizes: (state): { height: number; width: number } => {
      return {
        height: state.canvas?.offsetHeight!,
        width: state.canvas?.offsetWidth!,
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
