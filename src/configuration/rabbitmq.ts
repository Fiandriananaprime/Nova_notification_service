import amqp, {
  type Channel,
  type ChannelModel,
} from "amqplib";

import { env } from "./env.js";

let connection: ChannelModel;
let channel: Channel;

export async function connectRabbitMQ() {
  connection = await amqp.connect(env.rabbitmq.url);

  channel = await connection.createChannel();

  connection.on("error", (error) => {
    console.error("RabbitMQ connection error", error);
  });
  connection.on("close", () => {
    console.error("RabbitMQ connection closed; notification consumer is disconnected");
  });

  await channel.assertExchange(
    env.rabbitmq.exchange,
    "topic",
    {
      durable: true,
    },
  );

  await channel.assertQueue(
    env.rabbitmq.queues.email,
    {
      durable: true,
    },
  );

  await channel.assertQueue(
    env.rabbitmq.queues.phone,
    {
      durable: true,
    },
  );

  await channel.assertQueue(
    env.rabbitmq.queues.push,
    {
      durable: true,
    },
  );

  await channel.bindQueue(
    env.rabbitmq.queues.email,
    env.rabbitmq.exchange,
    "auth.code.requested",
  );

  await channel.bindQueue(
    env.rabbitmq.queues.email,
    env.rabbitmq.exchange,
    "order.created",
  );

  await channel.bindQueue(
    env.rabbitmq.queues.phone,
    env.rabbitmq.exchange,
    "auth.code.requested",
  );

  await channel.bindQueue(
    env.rabbitmq.queues.phone,
    env.rabbitmq.exchange,
    "delivery.updated",
  );

  await channel.bindQueue(
    env.rabbitmq.queues.push,
    env.rabbitmq.exchange,
    "order.created",
  );

  await channel.bindQueue(
    env.rabbitmq.queues.push,
    env.rabbitmq.exchange,
    "delivery.updated",
  );

  console.log("RabbitMQ connected");
}

export function getRabbitChannel() {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  return channel;
}