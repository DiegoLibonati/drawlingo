import type { Ack, AckResponse } from "@/types/responses";

import { safeAck } from "@/helpers/safe_ack.helper";

describe("safe_ack.helper", () => {
  describe("safeAck", () => {
    it("should call the ack function when it is defined", () => {
      const mockAck: jest.Mock = jest.fn();
      const response: AckResponse<null> = { ok: true, code: "X", message: "Y", data: null };

      const safe: Ack<null> = safeAck(mockAck);
      safe(response);

      expect(mockAck).toHaveBeenCalledWith(response);
    });

    it("should not throw when ack is undefined", () => {
      const response: AckResponse<null> = { ok: true, code: "X", message: "Y", data: null };

      const safe: Ack<null> = safeAck(undefined);

      expect(() => {
        safe(response);
      }).not.toThrow();
    });

    it("should return a function", () => {
      const result: Ack<null> = safeAck(undefined);

      expect(typeof result).toBe("function");
    });

    it("should pass the exact response to the ack function", () => {
      const mockAck: jest.Mock = jest.fn();
      const response: AckResponse<string> = { ok: false, code: "ERR", message: "fail" };

      const safe: Ack<string> = safeAck(mockAck);
      safe(response);

      expect(mockAck).toHaveBeenCalledWith({ ok: false, code: "ERR", message: "fail" });
    });
  });
});
