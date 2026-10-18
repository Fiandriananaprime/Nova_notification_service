import { afterEach, describe, expect, it, vi } from "vitest";
import { SmsService } from "../src/service/Sms.service.js";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("SmsService", () => {
  it("posts the phone number and message with the mock provider API key", async () => {
    vi.stubEnv("SMS_WEBHOOK_URL", "http://localhost:4010/__mock/verification/sendVerification");
    vi.stubEnv("MOCK_PROVIDER_API_KEY", "test-provider-api-key");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    await new SmsService().send("+261341234567", "Verification code: 123456.");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4010/__mock/verification/sendVerification",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": "test-provider-api-key",
        },
        body: JSON.stringify({
          phoneNumber: "+261341234567",
          message: "Verification code: 123456.",
        }),
      },
    );
  });
});