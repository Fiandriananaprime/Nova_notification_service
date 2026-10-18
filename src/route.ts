import type { FastifyInstance } from "fastify";
import type { NotificationService } from "./service/Notification.service.js";
import { NotificationController } from "./controller/Notification.controller.js";

export const routes = (app: FastifyInstance, notificationService: NotificationService) => {
    const notificationController = new NotificationController(notificationService);

    app.register((route) => {
        route.get("/account/notifications", notificationController.getUserNotifications.bind(notificationController))
        route.patch("/account/notifications/:notificationId", notificationController.markNotificationAsRead.bind(notificationController));
        route.patch("/account/notifications", notificationController.markAllNotificationsAsRead.bind(notificationController));
     }, { prefix: "/api" });
}
