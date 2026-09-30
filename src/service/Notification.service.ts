import { EmailService } from "./Email.service.js";
import { SmsService } from "./Sms.service.js";
import { verificationEmailTemplate } from "../templates/VerificationEmail.js";
import type { NotificationRepository } from "../repository/notification.repository.js";

export class NotificationService {
    constructor(
        private readonly emailService:EmailService,
        private readonly notificationRepository: NotificationRepository,
        private readonly smsService: SmsService,
    ){}

    async sendVerificationCode(data:{
        target:string,
        channel: "email" | "phone",
        purpose: "email_verification" | "phone_verification" | "email_change" | "phone_change" | "sudo",
        code: string,
        expiredAt: string
    }){
        if (data.channel === "email"){
            const html = verificationEmailTemplate(data.code,data.expiredAt,data.purpose);
            const subject = data.purpose === "sudo"
                ? "Nova-Market security verification code"
                : data.purpose === "email_change"
                    ? "Nova-Market email change verification code"
                    : "Nova-Market verification code";

            await this.emailService.send(data.target,subject,html)
            await this.notificationRepository.create({
                title: data.purpose === "sudo"
                    ? "Sudo verification"
                    : data.purpose === "email_change"
                        ? "Email change verification"
                        : "Email verification",
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

        const message = `NovaMarket verification code: ${data.code}. It expires at ${data.expiredAt}.`;
        await this.smsService.send(data.target, message);

        await this.notificationRepository.create({
            title: data.purpose === "sudo"
                ? "Sudo verification"
                : data.purpose === "phone_change"
                    ? "Phone change verification"
                    : "Phone verification",
            channel:"sms",
            body:"Verification SMS sent",
            metadata:{
                target: data.target,
                purpose: data.purpose,
                expiresAt: data.expiredAt,
            },
        });
    }
}