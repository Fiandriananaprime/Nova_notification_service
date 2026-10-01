import nodemailer from "nodemailer";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "../configuration/env.js";

export class EmailService {
    private readonly transporter;
    private readonly logoPath = resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../templates/NovaSign.png",
    );

    constructor (){
        this.transporter = nodemailer.createTransport({
            host:env.smtp.host,
            port:env.smtp.port,
            secure:env.smtp.port === 465,
            auth:{
                user:env.smtp.user,
                pass:env.smtp.password
            }
        })
    }


    async send (
        to:string,
        subject:string,
        html:string
    ){
        await this.transporter.sendMail({
            from:env.smtp.user,
            to,
            subject,
            html,
            attachments: [
                {
                filename: "NovaSign.png",
                path: this.logoPath,
                cid: "novamarket-logo",
                },
            ],
        })
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log("SMTP connection verified", {
                host: env.smtp.host,
                port: env.smtp.port,
                user: env.smtp.user.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
            });
        } catch (error) {
            console.error("SMTP connection verification failed", {
                host: env.smtp.host,
                port: env.smtp.port,
                user: env.smtp.user.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
                error,
            });
        }
    }
}