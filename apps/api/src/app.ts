import fastify, { FastifyInstance } from "fastify";
import { env } from "./infrastructure/env";
import { globalErrorHandler } from "./infrastructure/error-handler";
import { securityPlugin } from "./infrastructure/security";
import { rateLimitPlugin } from "./infrastructure/rate-limit";
import { registerHealthRoutes } from "./infrastructure/health-monitor";
import { jwtPlugin } from "./modules/auth/jwt.service";
import { authRoutes } from "./modules/auth/auth.routes";
import { workspaceRoutes } from "./modules/workspaces/workspace.routes";
import { repositoryRoutes } from "./modules/repositories/repository.routes";
import { notificationRoutes } from "./modules/notifications/notification.routes";
import { activityRoutes } from "./modules/activity/activity.routes";
import { timelineRoutes } from "./modules/timeline/timeline.routes";

import { githubRoutes } from "./modules/github/github.routes";
import { githubWebhookRoutes } from "./modules/github/github.webhook.routes";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger:
      env.NODE_ENV === "development"
        ? {
            level: env.LOG_LEVEL,
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
                singleLine: true,
              },
            },
          }
        : true,
    disableRequestLogging: true, 
  });

  // Global Error Handler
  app.setErrorHandler(globalErrorHandler);

  // Register Infrastructure Plugins
  app.register(securityPlugin);
  app.register(rateLimitPlugin);
  app.register(jwtPlugin);

  // Setup core observability and logging hooks
  app.addHook("onRequest", async (req, reply) => {
    req.log.info({ req: { method: req.method, url: req.url } }, "incoming request");
  });

  app.addHook("onResponse", async (req, reply) => {
    req.log.info({ res: { statusCode: reply.statusCode }, responseTime: reply.elapsedTime }, "request completed");
  });

  // Register Routes
  app.register(registerHealthRoutes);
  
  // Fallback for GitHub OAuth if the app is configured without /api/v1 prefix
  app.get("/auth/github/callback", (req, reply) => {
    const code = (req.query as any).code;
    return reply.redirect(`/api/v1/auth/github/callback?code=${code}`);
  });
  
  app.register(async (api) => {
    api.register(authRoutes, { prefix: "/auth" });
    api.register(workspaceRoutes, { prefix: "/workspaces" });
    api.register(repositoryRoutes, { prefix: "/repositories" });
    api.register(notificationRoutes, { prefix: "/notifications" });

    api.register(githubWebhookRoutes, { prefix: "/github" });
    api.register(githubRoutes, { prefix: "/github" });
  }, { prefix: "/api/v1" });

  app.register(async (api2) => {
    api2.register(activityRoutes);
    api2.register(timelineRoutes);
  }, { prefix: "/api/v1" });

  return app;
}
