import { FastifyInstance } from "fastify";
import {
  analyzeReviewController,
  getReviewController,
  getReviewCommentsController,
  getReviewDeploymentRiskController,
  getReviewExplanationSummaryController,
  getReviewFindingsController,
  getGitHubReviewLinksController,
  getReviewGroupedFindingsController,
  getReviewPatchesController,
  getReviewTestsController,
  getLifecycleStatusController,
  getPublishingHistoryController,
  publishReviewController,
  refreshPublishedReviewController,
  regenerateReviewArtifactsController
} from "../../controllers/review/review.controller";
import {
  dashboardBenchmarkComplianceController,
  dashboardMergeReadinessController,
  dashboardOverviewController,
  dashboardRecentReviewsController,
  dashboardRepositoryHealthController,
  dashboardReviewMetricsController,
  dashboardRiskTrendsController,
  repositoriesListController,
  repositoryByIdController,
  repositoryInsightsController,
  repositoryPullRequestsController
} from "../../controllers/review/dashboard.controller";

export async function reviewRoutes(app: FastifyInstance) {
  app.post("/review/analyze", analyzeReviewController);
  app.get("/review/:id", getReviewController);
  app.get("/review/:id/findings", getReviewFindingsController);
  app.get("/review/:id/patches", getReviewPatchesController);
  app.get("/review/:id/tests", getReviewTestsController);
  app.get("/review/:id/deployment-risk", getReviewDeploymentRiskController);
  app.get("/review/:id/comments", getReviewCommentsController);
  app.get("/review/:id/explanations", getReviewExplanationSummaryController);
  app.get("/review/:id/grouped-findings", getReviewGroupedFindingsController);
  app.post("/review/:id/regenerate", regenerateReviewArtifactsController);
  app.post("/review/:id/publish", publishReviewController);
  app.get("/review/:id/publishing-history", getPublishingHistoryController);
  app.get("/review/:id/github-links", getGitHubReviewLinksController);
  app.get("/review/:id/lifecycle", getLifecycleStatusController);
  app.post("/review/:id/refresh-published", refreshPublishedReviewController);

  app.get("/dashboard/overview", dashboardOverviewController);
  app.get("/dashboard/recent-reviews", dashboardRecentReviewsController);
  app.get("/dashboard/risk-trends", dashboardRiskTrendsController);
  app.get("/dashboard/repository-health", dashboardRepositoryHealthController);
  app.get("/dashboard/merge-readiness", dashboardMergeReadinessController);
  app.get("/dashboard/benchmark-compliance", dashboardBenchmarkComplianceController);
  app.get("/dashboard/review-metrics", dashboardReviewMetricsController);

  app.get("/repositories", repositoriesListController);
  app.get("/repositories/:id", repositoryByIdController);
  app.get("/repositories/:id/pull-requests", repositoryPullRequestsController);
  app.get("/repositories/:id/insights", repositoryInsightsController);
}
