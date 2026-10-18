const normalizePhoneNumber = (phoneNumber: string): string => {
  const compactPhoneNumber = phoneNumber.trim().replace(/[\s().-]/g, "");

  if (/^0\d{9}$/.test(compactPhoneNumber)) {
    return `+261${compactPhoneNumber.slice(1)}`;
  }

  if (/^\d{9}$/.test(compactPhoneNumber)) {
    return `+261${compactPhoneNumber}`;
  }

  if (/^261\d{9}$/.test(compactPhoneNumber)) {
    return `+${compactPhoneNumber}`;
  }

  return compactPhoneNumber;
};

export class SmsService {
  async send(phoneNumber: string, message: string): Promise<void> {
    const endpoint = process.env["SMS_WEBHOOK_URL"];
    if (!endpoint) {
      throw new Error("SMS transport is not configured");
    }

    const apiKey = process.env["MOCK_PROVIDER_API_KEY"];
    if (!apiKey) {
      throw new Error("Mock provider API key is not configured");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ phoneNumber: normalizePhoneNumber(phoneNumber), message }),
    });

    if (!response.ok) {
      throw new Error(`SMS provider returned HTTP ${response.status}`);
    }
  }
}
