import "dotenv/config";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env["PORT"]),

  rabbitmq: {
    url: requiredEnv("RABBITMQ_URL"),
    exchange: requiredEnv("RABBITMQ_EXCHANGE"),

    queues: {
      email: requiredEnv("RABBITMQ_EMAIL_QUEUE"),
      phone: requiredEnv("RABBITMQ_PHONE_QUEUE"),
      push: requiredEnv("RABBITMQ_PUSH_QUEUE"),
    },
  },

  smtp: {
    host: requiredEnv("SMTP_HOST"),
    user: requiredEnv("SMTP_USER"),
    port: Number(process.env["SMTP_PORT"]),
    password: requiredEnv("SMTP_PASSWORD"),
    from: requiredEnv("SMTP_FROM"),
  },
};