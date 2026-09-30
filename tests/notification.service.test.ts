import { describe, expect, it, vi } from "vitest";
import { NotificationService } from "../src/service/Notification.service.js";

describe("NotificationService verification codes", () => {
  it("sends sudo codes by email with a security subject", async () => {
    const emailService = { send: vi.fn() };
    const notificationRepository = { create: vi.fn() };
    const smsService = { send: vi.fn() };
    const service = new NotificationService(
      emailService as any,
      notificationRepository as any,
      smsService as any,
    );

    await service.sendVerificationCode({
      target: "user@example.com",
      channel: "email",
      purpose: "sudo",
      code: "123456",
      expiredAt: new Date().toISOString(),
    });

    expect(emailService.send).toHaveBeenCalledWith(
      "user@example.com",
      "Nova-Market security verification code",
      expect.stringContaining("123456"),
    );
    expect(notificationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Sudo verification", channel: "email" }),
    );
  });

  it("sends phone codes through the SMS transport", async () => {
    const emailService = { send: vi.fn() };
    const notificationRepository = { create: vi.fn() };
    const smsService = { send: vi.fn() };
    const service = new NotificationService(
      emailService as any,
      notificationRepository as any,
      smsService as any,
    );

    await service.sendVerificationCode({
      target: "+33123456789",
      channel: "phone",
      purpose: "phone_verification",
      code: "654321",
      expiredAt: new Date().toISOString(),
    });

    expect(smsService.send).toHaveBeenCalledWith(
      "+33123456789",
      expect.stringContaining("654321"),
    );
    expect(notificationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Phone verification", channel: "sms" }),
    );
  });
});