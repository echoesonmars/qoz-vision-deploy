import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";
import { getAllowedOrigins } from "../config/env.js";

export async function registerCors(app: FastifyInstance) {
  const origins = getAllowedOrigins();
  const allowAll = origins.includes("*");
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowAll) {
        cb(null, true);
        return;
      }
      if (origins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("CORS not allowed"), false);
    },
    credentials: true,
  });
}
