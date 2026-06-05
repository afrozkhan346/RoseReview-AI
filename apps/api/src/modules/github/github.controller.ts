import { FastifyRequest, FastifyReply } from "fastify";
import { GitHubService } from "../../integrations/github/github.service";
import { prisma } from "../../lib/prisma";
import { errorResponse, successResponse } from "../../infrastructure/api-response";
import { logger } from "../../infrastructure/logger";
import { decrypt } from "../../utils/encryption";

export class GithubController {
  async getRepositories(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || !user.githubToken) {
      return reply.status(400).send(errorResponse("NO_GITHUB_TOKEN", "User has not connected GitHub", null, request.id));
    }

    try {
      const githubService = new GitHubService(logger, decrypt(user.githubToken));
      const repos = await githubService.fetchUserRepositories();
      return reply.send(successResponse(repos, "Fetched repositories successfully", undefined, request.id));
    } catch (error: any) {
      return reply.status(500).send(errorResponse("GITHUB_ERROR", "Failed to fetch repositories from GitHub", null, request.id));
    }
  }

  async getPullRequest(request: FastifyRequest<{ Params: { number: string }; Querystring: { owner: string; repo: string } }>, reply: FastifyReply) {
    const userId = request.user.id;
    const { number } = request.params;
    const { owner, repo } = request.query;

    if (!owner || !repo || !number) {
      return reply.status(400).send(errorResponse("BAD_REQUEST", "owner, repo, and PR number are required", null, request.id));
    }

    const prNumber = parseInt(number, 10);
    if (isNaN(prNumber)) {
      return reply.status(400).send(errorResponse("BAD_REQUEST", "PR number must be a valid integer", null, request.id));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.githubToken) {
      return reply.status(400).send(errorResponse("NO_GITHUB_TOKEN", "User has not connected GitHub", null, request.id));
    }

    try {
      const githubService = new GitHubService(logger, decrypt(user.githubToken));
      const pr = await githubService.fetchPullRequest({ owner, repo, number: prNumber });
      return reply.send(successResponse(pr, "Fetched pull request successfully", undefined, request.id));
    } catch (error: any) {
      return reply.status(error.status || 500).send(errorResponse("GITHUB_ERROR", "Failed to fetch pull request from GitHub", null, request.id));
    }
  }

  async getPullRequests(request: FastifyRequest<{ Querystring: { owner: string; repo: string } }>, reply: FastifyReply) {
    const userId = request.user.id;
    const { owner, repo } = request.query;

    if (!owner || !repo) {
      return reply.status(400).send(errorResponse("BAD_REQUEST", "owner and repo query parameters are required", null, request.id));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.githubToken) {
      return reply.status(400).send(errorResponse("NO_GITHUB_TOKEN", "User has not connected GitHub", null, request.id));
    }

    try {
      const githubService = new GitHubService(logger, decrypt(user.githubToken));
      const prs = await githubService.fetchRepositoryPullRequests(owner, repo);
      return reply.send(successResponse(prs, "Fetched pull requests successfully", undefined, request.id));
    } catch (error: any) {
      return reply.status(500).send(errorResponse("GITHUB_ERROR", "Failed to fetch pull requests from GitHub", null, request.id));
    }
  }

  async postPullRequestComment(request: FastifyRequest<{ Params: { number: string }; Body: { owner: string; repo: string; body: string } }>, reply: FastifyReply) {
    const userId = request.user.id;
    const { number } = request.params;
    const { owner, repo, body } = request.body;

    if (!owner || !repo || !number || !body) {
      return reply.status(400).send(errorResponse("BAD_REQUEST", "owner, repo, number, and body are required", null, request.id));
    }

    const prNumber = parseInt(number, 10);
    if (isNaN(prNumber)) {
      return reply.status(400).send(errorResponse("BAD_REQUEST", "PR number must be a valid integer", null, request.id));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.githubToken) {
      return reply.status(400).send(errorResponse("NO_GITHUB_TOKEN", "User has not connected GitHub", null, request.id));
    }

    try {
      const githubService = new GitHubService(logger, decrypt(user.githubToken));
      const comment = await githubService.postPullRequestComment({ owner, repo, number: prNumber }, body);
      return reply.send(successResponse(comment, "Comment posted successfully", undefined, request.id));
    } catch (error: any) {
      return reply.status(error.status || 500).send(errorResponse("GITHUB_ERROR", "Failed to post comment to GitHub", null, request.id));
    }
  }
}

export const githubController = new GithubController();
