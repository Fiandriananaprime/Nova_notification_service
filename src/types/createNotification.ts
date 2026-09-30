import type { Prisma } from "../generated/prisma/index.js"

export type createNotication  = {
    channel: NotificationChannel
    title:string
    body:string
    metadata: Prisma.InputJsonValue

}
type NotificationChannel = "email" | "push" | "sms"
