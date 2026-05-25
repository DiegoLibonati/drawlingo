import { createServer } from "node:http";
import { io as ioc } from "socket.io-client";

import type { Server as HttpServer } from "node:http";
import type { AddressInfo } from "node:net";
import type { Socket as ClientSocket } from "socket.io-client";
import type { IO } from "@/types/socket";

import { initSockets } from "@/sockets";

jest.mock("@/services/redis.service");
jest.mock("uuid", () => ({ v4: jest.fn() }));

describe("sockets/index", () => {
  let httpServer: HttpServer;
  let io: IO;
  let clientSocket: ClientSocket | undefined;

  afterEach((done): void => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    void io.close(() => {
      httpServer.close(() => {
        done();
      });
    });
  });

  it("should initialize an io server and accept connections", (done): void => {
    httpServer = createServer();
    io = initSockets(httpServer);

    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      clientSocket = ioc(`http://localhost:${port}`, { transports: ["websocket"] });

      clientSocket.on("connect", () => {
        expect(clientSocket?.connected).toBe(true);
        done();
      });
    });
  });

  it("should disconnect the client cleanly", (done): void => {
    httpServer = createServer();
    io = initSockets(httpServer);

    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      clientSocket = ioc(`http://localhost:${port}`, { transports: ["websocket"] });

      clientSocket.on("connect", () => {
        clientSocket?.on("disconnect", () => {
          done();
        });
        clientSocket?.disconnect();
      });
    });
  });
});
