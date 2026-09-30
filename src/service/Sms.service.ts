export class SmsService {
  async send(target: string, message: string): Promise<void> {
    const endpoint = process.env["SMS_WEBHOOK_URL"];
    if (!endpoint) {
      throw new Error("SMS transport is not configured");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target, message }),
    });

    if (!response.ok) {
      throw new Error(`SMS provider returned HTTP ${response.status}`);
    }
  }
}