import {getRabbitChannel} from "../configuration/rabbitmq.js";
import { env } from "../configuration/env.js";
import type { AuthCodeRequestedEvent } from "../types/event.js";
import { NotificationService } from "../service/Notification.service.js";

export class NotificationConsumer {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  async start() {
    const channel = getRabbitChannel();

    const consume = async (queue: string, queueChannel: "email" | "phone") => channel.consume(queue,
      async (message) => {
        if (!message) return;

        try {
          const event =
            JSON.parse(
              message.content.toString(),
            ) as AuthCodeRequestedEvent;

          if (
            event.type !==
            "auth.code.requested"
          ) {
            channel.ack(message);
            return;
          }

          const eventChannel = event.payload.channel ?? queueChannel;
          if (eventChannel !== queueChannel) {
            channel.ack(message);
            return;
          }

          await this.notificationService.sendVerificationCode({
                target:event.payload.target,
                channel:eventChannel,
                purpose:event.payload.purpose ?? (eventChannel === "email"
                  ? "email_verification"
                  : "phone_verification"),
                code:event.payload.code,
                expiredAt:event.payload.expiresAt
          });

          channel.ack(message);

        } catch (error) {

          channel.nack(
            message,
            false,
            false,
          );
        }
      },
    );

    await Promise.all([
      consume(env.rabbitmq.queues.email, "email"),
      consume(env.rabbitmq.queues.phone, "phone"),
    ]);
  }
}