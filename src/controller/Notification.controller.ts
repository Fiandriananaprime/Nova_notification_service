import type { FastifyReply, FastifyRequest } from "fastify";
import type { NotificationService } from "../service/Notification.service.js";
import { UnauthorizedError } from "../errorHandler/UnauthorizedError.js";
import { AppError } from "../errorHandler/AppError.js";

type NotificationQuery = { page?: string; limit?: string };

const parsePaginationValue = (value: string | undefined, fallback: number, max?: number) => {
    if (value === undefined) return fallback;

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || (max !== undefined && parsed > max)) {
        throw new AppError("VALIDATION_ERROR", 400, `Pagination value must be an integer between 1 and ${max ?? "infinity"}`);
    }

    return parsed;
};

export class NotificationController {
    private readonly notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    async getUserNotifications(request: FastifyRequest<{ Querystring: NotificationQuery }>, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        const page = parsePaginationValue(request.query.page, 1);
        const limit = parsePaginationValue(request.query.limit, 20, 100);
        const notifications = await this.notificationService.getUserNotifications(userId, page, limit);
        return reply.status(200).send(notifications);
    }

    async markNotificationAsRead(request: FastifyRequest<{ Params: { notificationId: string } }>, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        const { notificationId } = request.params;
        await this.notificationService.markNotificationAsRead(userId, notificationId);
        return reply.status(204).send();
    }

    async markAllNotificationsAsRead(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        await this.notificationService.markAllNotificationsAsRead(userId);
        return reply.status(204).send();
    }

    async deleteNotification(request: FastifyRequest<{ Params: { notificationId: string } }>, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        const { notificationId } = request.params;
        await this.notificationService.deleteNotification(userId, notificationId);
        return reply.status(204).send({ message: "Notification deleted" });
    }

    async deleteAllNotifications(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId;
        if (!userId) throw new UnauthorizedError("User not authenticated");
        await this.notificationService.deleteAllNotifications(userId);
        return reply.status(204).send({ message: "All notifications deleted" });
    }
}
