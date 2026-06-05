import { FastifyPluginAsync } from "fastify";
import crypto from "crypto";
import { env } from "../../infrastructure/env";
import { WebhookProcessingService } from "../../services/webhook-processing.service";
import { errorResponse } from "../../infrastructure/api-response";

export const githubWebhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/webhook", async (request, reply) => {
    const signature = request.headers["x-hub-signature-256"] as string;
    if (!signature || !env.WEBHOOK_SECRET) {
      return reply.status(401).send(errorResponse("UNAUTHORIZED", "Missing signature or webhook secret", null, request.id));
    }

    const payloadString = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
    const hmac = crypto.createHmac("sha256", env.WEBHOOK_SECRET);
    const expectedSignature = `sha256=${hmac.update(payloadString).digest("hex")}`;
    
    try {
      const sigBuf = Buffer.from(signature);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return reply.status(401).send(errorResponse("UNAUTHORIZED", "Invalid signature", null, request.id));
      }
    } catch (err) {
      return reply.status(401).send(errorResponse("UNAUTHORIZED", "Invalid signature format", null, request.id));
    }

    try {
      const webhookService = new WebhookProcessingService(fastify);
      await webhookService.processGitHubWebhook(request.body, request.headers as Record<string, string | string[] | undefined>);
      return reply.status(200).send({ success: true });
    } catch (error: any) {
      if (error.statusCode === 202 || error.code === 'UNSUPPORTED_WEBHOOK_EVENT') {
        return reply.status(202).send({ success: true, message: "Event ignored" });
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse("INTERNAL_ERROR", "Failed to process webhook", null, request.id));
    }
  });
};
