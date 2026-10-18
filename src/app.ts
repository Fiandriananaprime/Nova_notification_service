import Fastify from "fastify"
import { 
  registerHealth,registerReady, 
  registerVersion,registerMetrics 
} from "@Fiandriananaprime/service-core";

import { routes } from "./route.js"

import { prisma } from "./database/prisma.js";
import { EmailService } from "./service/Email.service.js";
import { NotificationService } from "./service/Notification.service.js";
import { SmsService } from "./service/Sms.service.js";
import { NotificationConsumer } from "./consumer/Notification.consumer.js";

import { connectRabbitMQ } from "./configuration/rabbitmq.js";
import { NotificationRepository } from "./repository/notification.repository.js";
import { AppError } from "./errorHandler/AppError.js";
import { userContext } from "./middleware/userContext.js";

export const app = Fastify();

app.addHook("preHandler", userContext);

const notificationRepository =new  NotificationRepository();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(emailService,notificationRepository,smsService);
const notificationConsumer = new NotificationConsumer(notificationService);

await emailService.verifyConnection();
await connectRabbitMQ();
await notificationConsumer.start();

registerHealth(app);

registerReady(app, {
  database: async () => {
    await prisma.$queryRaw`SELECT 1`;
  }
})

registerVersion(app, {
  service: "notification service",
  version: process.env["SERVICE_VERSION"] ?? "unknown",
  commit: process.env["GIT_COMMIT"] ?? "unknown"
});

registerMetrics(app);

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

   if (
    typeof error === "object" &&
    error !== null &&
    "validation" in error
  ) {
    return reply.status(400).send({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.validation,
      },
    });
  }
  
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  return reply.status(500).send({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
});

routes(app,notificationService);
