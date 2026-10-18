import { EmailService } from "./Email.service.js";
import { SmsService } from "./Sms.service.js";
import { verificationEmailTemplate } from "../templates/VerificationEmail.js";
import type { NotificationRepository } from "../repository/notification.repository.js";
import { RessourcesNotFoundError } from "../errorHandler/RessourcesNotFoundError.js";

export class NotificationService {
    constructor(
        private readonly emailService:EmailService,
        private readonly notificationRepository: NotificationRepository,
        private readonly smsService: SmsService,
    ){}

    async sendVerificationCode(data:{
        userId: string,
        phoneNumber:string,
        channel: "email" | "phone",
        purpose: "email_verification" | "phone_verification" | "email_change" | "phone_change" | "reset_password" | "sudo",
        code: string,
        expiredAt: string
    }){
        if (data.channel === "email"){
            const html = verificationEmailTemplate(data.code,data.expiredAt,data.purpose);
            const subject = data.purpose === "sudo"
                ? "Nova-Market security verification code"
                : data.purpose === "email_change"
                    ? "Nova-Market email change verification code"
                    : data.purpose === "reset_password"
                        ? "Nova-Market password reset code"
                        : "Nova-Market verification code";

            await this.emailService.send(data.phoneNumber,subject,html)
            await this.notificationRepository.create({
                userId: data.userId,
                type: "security",
                title: data.purpose === "sudo"
                    ? "Sudo verification"
                    : data.purpose === "email_change"
                        ? "Email change verification"
                        : "Email verification",
                channel:"email",
                body:"Verification email sent",
                metadata:{
                    target: data.phoneNumber,
                    purpose: data.purpose,
                    expiresAt: data.expiredAt,
                },
            })
            return;
        }

        const message = `Verification code: ${data.code}. It expires at ${data.expiredAt}.`;
        await this.smsService.send(data.phoneNumber, message);

        await this.notificationRepository.create({
            userId: data.userId,
            type: "security",
            title: data.purpose === "sudo"
                ? "Sudo verification"
                : data.purpose === "phone_change"
                    ? "Phone change verification"
                    : "Phone verification",
            channel:"sms",
            body:"Verification SMS sent",
            metadata:{
                target: data.phoneNumber,
                purpose: data.purpose,
                expiresAt: data.expiredAt,
            },
        });
    }

    async getUserNotifications(userId: string, page: number, limit: number) {
        const { notifications, total } = await this.notificationRepository.findByUserId(userId, page, limit);

        return {
            data: notifications.map((notification) => ({
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.body,
                data: notification.metadata,
                read: notification.status === "read",
                createdAt: notification.createdAt,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async markNotificationAsRead(userId: string, notificationId: string) {
        const notification = await this.notificationRepository.markAsRead(userId, notificationId);

        if (!notification) throw new RessourcesNotFoundError("Notification not found");

    }

    async markAllNotificationsAsRead(userId: string) {
        return this.notificationRepository.markAllAsRead(userId);
    }

    async deleteNotification(userId: string, notificationId: string) {
        const notification = await this.notificationRepository.deleteNotification(userId, notificationId);
        if (!notification) throw new RessourcesNotFoundError("Notification not found");
    }

    async deleteAllNotifications(userId: string) {
        return this.notificationRepository.deleteAllNotifications(userId);
    }
}
