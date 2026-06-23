import fp from "fastify-plugin";
import fastifyOAuth2 from "@fastify/oauth2";
import { FastifyInstance } from "fastify";
import { env } from "../infrastructure/env";

export const oauthPlugin = fp(async (fastify: FastifyInstance) => {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    fastify.log.warn("GitHub OAuth credentials missing. OAuth login will fail.");
  }

  await fastify.register(fastifyOAuth2, {
    name: "githubOAuth2",
    scope: ["read:user", "user:email", "repo"],
    credentials: {
      client: {
        id: env.GITHUB_CLIENT_ID || "",
        secret: env.GITHUB_CLIENT_SECRET || "",
      },
      auth: fastifyOAuth2.GITHUB_CONFIGURATION,
    },
    // The oauth2 plugin intercepts this route to start the login process
    startRedirectPath: "/api/v1/auth/github",
    callbackUri: env.GITHUB_CALLBACK_URL,
  });
});
