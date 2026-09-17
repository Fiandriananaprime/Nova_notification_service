import { prisma } from "../database/prisma.js";
import type { createNotication } from "../types/createNotification.js";

export class NotificationRepository {
    constructor(){}

    async create(data:createNotication){
        await prisma.notification.create({data})
    }
}