import { EmailService } from "./Email.service.js";
import { verificationEmailTemplate } from "../templates/VerificationEmail.js";
import type { NotificationRepository } from "../repository/notification.repository.js";

export class NotificationService {
    constructor(
        private readonly emailService:EmailService,
        private readonly notificationRepository: NotificationRepository
    ){}

    async sendVerificationCode(data:{
        target:string,
        channel: "email" | "phone",
        purpose: "email_verification" | "phone_verification",
        code: string,
        expiredAt: string
    }){
        if (data.channel === "email"){
            const html = verificationEmailTemplate(data.code,data.expiredAt);

            await this.emailService.send(data.target,"Nova-Market verification code",html)
            await this.notificationRepository.create({
                title:"Email verification",
                channel:"email",
                body:"Verification email sent",
                metadata:{
                    target: data.target,
                    purpose: data.purpose,
                    expiresAt: data.expiredAt,
                },
            })
            return;
        }

        await this.notificationRepository.create({
            title:"Phone verification pending",
            channel:"sms",
            body:"Phone verification requires an SMS provider",
            metadata:{
                target: data.target,
                purpose: data.purpose,
                expiresAt: data.expiredAt,
            },
        });
    }
}