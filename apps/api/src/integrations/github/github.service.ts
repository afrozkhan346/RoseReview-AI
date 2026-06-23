import { FastifyBaseLogger } from "fastify";
import { GitHubClient } from "./github.client";
import {
  BranchComparisonSummary,
  GitHubChangedFile,
  GitHubCommit,
  GitHubPullRequestRef,
  RepositoryContextSummary,
  RepositoryMetadata
} from "./github.types";
import { detectSignals } from "./github.utils";

export class GitHubService {
  private client: GitHubClient;

  constructor(private logger: FastifyBaseLogger, token?: string) {
    this.client = new GitHubClient(logger, token);
  }

  async fetchPullRequest(ref: GitHubPullRequestRef) {
    const res = await this.client.retrySafe("pulls.get", async () =>
      this.client.rest.pulls.get({ owner: ref.owner, repo: ref.repo, pull_number: ref.number })
    );
    return res.data;
  }

  async fetchUserRepositories() {
    const res = await this.client.retrySafe("repos.listForAuthenticatedUser", async () =>
      this.client.rest.repos.listForAuthenticatedUser({ sort: "updated", per_page: 50 })
    );
    return res.data;
  }

  async fetchRepositoryPullRequests(owner: string, repo: string) {
    const res = await this.client.retrySafe("pulls.list", async () =>
      this.client.rest.pulls.list({ owner, repo, state: "open", sort: "updated", direction: "desc", per_page: 50 })
    );
    return res.data;
  }

  async fetchChangedFiles(ref: GitHubPullRequestRef): Promise<GitHubChangedFile[]> {
    const res = await this.client.retrySafe("pulls.listFiles", async () =>
      this.client.rest.pulls.listFiles({ owner: ref.owner, repo: ref.repo, pull_number: ref.number, per_page: 100 })
    );
    return res.data.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
      patch: f.patch ?? undefined
    }));
  }

  async fetchCommits(ref: GitHubPullRequestRef): Promise<GitHubCommit[]> {
    const res = await this.client.retrySafe("pulls.listCommits", async () =>
      this.client.rest.pulls.listCommits({ owner: ref.owner, repo: ref.repo, pull_number: ref.number, per_page: 100 })
    );
    return res.data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.author?.login
    }));
  }

  async fetchRepositoryMetadata(ref: { owner: string; repo: string }): Promise<RepositoryMetadata> {
    const res = await this.client.retrySafe("repos.get", async () =>
      this.client.rest.repos.get({ owner: ref.owner, repo: ref.repo })
    );
    return {
      id: res.data.id,
      name: res.data.name,
      fullName: res.data.full_name,
      defaultBranch: res.data.default_branch,
      private: res.data.private,
      topics: res.data.topics ?? []
    };
  }

  async fetchBranchComparison(ref: { owner: string; repo: string; base: string; head: string }): Promise<BranchComparisonSummary> {
    const res = await this.client.retrySafe("repos.compareCommits", async () =>
      this.client.rest.repos.compareCommits({ owner: ref.owner, repo: ref.repo, base: ref.base, head: ref.head })
    );
    return {
      aheadBy: res.data.ahead_by,
      behindBy: res.data.behind_by,
      totalCommits: res.data.total_commits,
      changedFiles: res.data.files?.length ?? 0
    };
  }

  async fetchContributors(ref: { owner: string; repo: string }) {
    const res = await this.client.retrySafe("repos.listContributors", async () =>
      this.client.rest.repos.listContributors({ owner: ref.owner, repo: ref.repo, per_page: 30 })
    );
    return res.data.map((c) => ({ login: c.login, contributions: c.contributions }));
  }

  async fetchRepositoryLanguages(ref: { owner: string; repo: string }) {
    const res = await this.client.retrySafe("repos.listLanguages", async () =>
      this.client.rest.repos.listLanguages({ owner: ref.owner, repo: ref.repo })
    );
    return Object.keys(res.data);
  }

  async fetchCommitHistory(ref: { owner: string; repo: string; branch?: string }) {
    const res = await this.client.retrySafe("repos.listCommits", async () =>
      this.client.rest.repos.listCommits({ owner: ref.owner, repo: ref.repo, sha: ref.branch, per_page: 30 })
    );
    return res.data.map((c) => ({ sha: c.sha, message: c.commit.message }));
  }

  async postPullRequestComment(ref: GitHubPullRequestRef, body: string) {
    return this.client.retrySafe("issues.createComment", async () =>
      this.client.rest.issues.createComment({
        owner: ref.owner,
        repo: ref.repo,
        issue_number: ref.number,
        body
      })
    );
  }

  createReviewSummary(input: {
    prTitle: string;
    impactScore: number;
    severity: string;
    riskyFiles: string[];
    context: RepositoryContextSummary;
  }) {
    return [
      `## RoseReview Summary`,
      `PR: ${input.prTitle}`,
      `Risk Severity: **${input.severity.toUpperCase()}**`,
      `Impact Score: **${input.impactScore}**`,
      `Risky Files: ${input.riskyFiles.length ? input.riskyFiles.join(", ") : "None detected"}`,
      `Languages: ${input.context.languages.join(", ") || "Unknown"}`,
      `Framework Signals: ${input.context.frameworkSignals.join(", ") || "Unknown"}`
    ].join("\n");
  }

  createRepositoryContextFromFiles(repoName: string, filePaths: string[], languages: string[]): RepositoryContextSummary {
    const signals = detectSignals(filePaths);
    return {
      repositoryName: repoName,
      languages,
      frameworkSignals: [...signals.frontendFrameworks, ...signals.backendFrameworks],
      packageManagers: signals.packageManagers,
      dependencyFiles: filePaths.filter((p) => /package\.json|requirements\.txt|pyproject\.toml|go\.mod|pom\.xml/i.test(p)),
      testingFrameworks: signals.testingFrameworks,
      infrastructureFiles: signals.infrastructureFiles,
      benchmarks: {
        codingConventions: ["small focused functions", "clear naming", "typed boundaries"],
        architecturalRules: ["respect module boundaries", "avoid cross-layer coupling"],
        reviewExpectations: ["include risk context", "document breaking changes", "add tests for logic changes"],
        namingStandards: ["use descriptive identifiers", "consistent domain terminology"],
        testingRequirements: ["cover risky branches", "include regression tests for bugs"]
      }
    };
  }
}
