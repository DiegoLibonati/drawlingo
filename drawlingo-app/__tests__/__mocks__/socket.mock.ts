import { vi } from "vitest";

type Listener = (...args: unknown[]) => void;

export interface MockSocket {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  once: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  connected: boolean;
  id: string;
  __listeners: Map<string, Set<Listener>>;
  __serverEmit: (event: string, ...args: unknown[]) => void;
  __reset: () => void;
}

export const createMockSocket = (): MockSocket => {
  const listeners = new Map<string, Set<Listener>>();

  const onImpl = (event: string, listener: Listener): MockSocket => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(listener);
    return socket;
  };

  const onceImpl = (event: string, listener: Listener): MockSocket => {
    if (!listeners.has(event)) listeners.set(event, new Set());
    const wrappedListener: Listener = (...args: unknown[]) => {
      listeners.get(event)?.delete(wrappedListener);
      listener(...args);
    };
    listeners.get(event)!.add(wrappedListener);
    return socket;
  };

  const offImpl = (event: string, listener?: Listener): MockSocket => {
    if (!listener) {
      listeners.delete(event);
    } else {
      listeners.get(event)?.delete(listener);
    }
    return socket;
  };

  const emitImpl = (): MockSocket => socket;

  const connectImpl = (): MockSocket => {
    socket.connected = true;
    return socket;
  };

  const disconnectImpl = (): MockSocket => {
    socket.connected = false;
    return socket;
  };

  const socket: MockSocket = {
    connected: false,
    id: "mock-socket-id",
    __listeners: listeners,
    on: vi.fn(onImpl),
    once: vi.fn(onceImpl),
    off: vi.fn(offImpl),
    emit: vi.fn(emitImpl),
    connect: vi.fn(connectImpl),
    disconnect: vi.fn(disconnectImpl),
    __serverEmit(event: string, ...args: unknown[]) {
      listeners.get(event)?.forEach((l) => {
        l(...args);
      });
    },
    __reset() {
      listeners.clear();
      socket.connected = false;
      socket.on.mockReset().mockImplementation(onImpl);
      socket.off.mockReset().mockImplementation(offImpl);
      socket.once.mockReset().mockImplementation(onceImpl);
      socket.emit.mockReset().mockImplementation(emitImpl);
      socket.connect.mockReset().mockImplementation(connectImpl);
      socket.disconnect.mockReset().mockImplementation(disconnectImpl);
    },
  };
  return socket;
};

export const mockSocket = createMockSocket();
