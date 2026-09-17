import Fastify from "fastify"
import { 
  registerHealth,registerReady, 
  registerVersion,registerMetrics 
} from "@Fiandriananaprime/service-core";

import { routes } from "./route.js"

import { prisma } from "./database/prisma.js";
import { EmailService } from "./service/Email.service.js";
import { NotificationService } from "./service/Notification.service.js";
import { NotificationConsumer } from "./consumer/Notification.consumer.js";

import { connectRabbitMQ } from "./configuration/rabbitmq.js";
import { NotificationRepository } from "./repository/notification.repository.js";

export const app = Fastify();

const notificationRepository =new  NotificationRepository();
const emailService = new EmailService();
const notificationService = new NotificationService(emailService,notificationRepository);
const notificationConsumer = new NotificationConsumer(notificationService);

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

routes(app)

