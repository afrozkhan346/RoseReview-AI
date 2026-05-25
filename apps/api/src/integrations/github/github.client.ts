import { FastifyBaseLogger } from "fastify";
import { Octokit } from "octokit";
import { env } from "../../config/env";
import { AppError } from "../../lib/errors";

export class GitHubClient {
  private octokit: Octokit;

  constructor(private logger: FastifyBaseLogger, token?: string) {
    this.octokit = new Octokit({ auth: token || env.GITHUB_TOKEN });
  }

  private async withGitHubCall<T>(name: string, fn: () => Promise<T>) {
    try {
      const result = await fn();
      this.logger.debug({ integration: "github", call: name }, "GitHub API call completed");
      return result;
    } catch (error: any) {
      const status = error?.status ?? 500;
      const message = error?.message ?? "GitHub API request failed";
      this.logger.error({ integration: "github", call: name, status, message }, "GitHub API error");
      if (status === 403) {
        throw new AppError("GITHUB_RATE_LIMIT_OR_FORBIDDEN", 502, "GitHub API request blocked", {
          call: name,
          status
        });
      }
      throw new AppError("GITHUB_API_ERROR", 502, message, { call: name, status });
    }
  }

  get rest() {
    return this.octokit.rest;
  }

  async getRateLimit() {
    return this.withGitHubCall("rateLimit.get", async () => this.octokit.rest.rateLimit.get());
  }

  async retrySafe<T>(name: string, fn: () => Promise<T>, retries = 2): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await this.withGitHubCall(name, fn);
      } catch (error) {
        if (attempt >= retries) throw error;
        attempt += 1;
      }
    }
  }
}
