import { FastifyPluginAsync } from "fastify";
import { githubController } from "./github.controller";

export const githubRoutes: FastifyPluginAsync = async (fastify) => {
  // Ensure the user is authenticated for all GitHub routes
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/repositories", githubController.getRepositories.bind(githubController));
  fastify.get("/pull-requests", githubController.getPullRequests.bind(githubController));
  fastify.get("/pull-requests/:number", githubController.getPullRequest.bind(githubController));
  fastify.post("/pull-requests/:number/comments", githubController.postPullRequestComment.bind(githubController));
};
