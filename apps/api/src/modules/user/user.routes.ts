import { FastifyPluginAsync } from "fastify";
import { userController } from "./user.controller";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  // Ensure the user is authenticated for all user routes
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.post("/onboarding", userController.saveOnboarding.bind(userController));
  fastify.patch("/profile", userController.updateProfile.bind(userController));
};
