import nodemailer from "nodemailer";
import { env } from "../configuration/env.js";

export class EmailService {
    private readonly transporter;

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
                path: "../templates/NovaSign.png",
                cid: "novamarket-logo",
                },
            ],
        })
    }
}