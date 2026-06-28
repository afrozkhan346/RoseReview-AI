import { FastifyInstance } from "fastify";
import {
  analyzeReviewController,
  generatePatchController,
  generateTestsController,
  getReviewController
} from "../controllers/review.controller";

export async function reviewRoute(app: FastifyInstance) {
  app.post("/review/analyze", analyzeReviewController);
  app.get("/review/:id", getReviewController);
  app.post("/review/generate-patch", generatePatchController);
  app.post("/review/generate-tests", generateTestsController);
}
