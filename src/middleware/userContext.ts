import type { FastifyRequest } from "fastify";

export const userContext = async (request: FastifyRequest) => {
  const userId = request.headers["x-user-id"];

  request.userId = typeof userId === "string" && userId.length > 0
    ? userId
    : null;
};