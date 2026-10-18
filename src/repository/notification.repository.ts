import { prisma } from "../database/prisma.js";
import type { createNotication } from "../types/createNotification.js";

export class NotificationRepository {
    constructor(){}

    async create(data:createNotication){
        await prisma.notification.create({data})
    }

    async findByUserId(userId: string, page: number, limit: number) {
        const where = { userId };
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: [{ createdAt: "desc" }, { id: "desc" }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.notification.count({ where }),
        ]);

        return { notifications, total };
    }

    async markAsRead(userId: string, notificationId: string) {
        const result = await prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { status: "read",readAt: new Date() },
        });
        return result.count > 0;
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, channel: "push" },
            data: { status: "read",readAt: new Date() },
        });
    }

    async deleteNotification(userId: string, notificationId: string) {
        return prisma.notification.delete({
            where: { id: notificationId, userId },
        });
    }

    async deleteAllNotifications(userId: string) {
        return prisma.notification.deleteMany({
            where: { userId },
        });
    }
}
