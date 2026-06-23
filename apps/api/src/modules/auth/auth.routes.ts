import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";

export async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post("/register", authController.register.bind(authController));
  fastify.post("/login", authController.login.bind(authController));
  fastify.get("/github", authController.githubLogin.bind(authController));
  fastify.get("/github/callback", authController.githubCallback.bind(authController));
  
  // Protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("onRequest", fastify.authenticate);
    
    protectedRoutes.post("/logout", authController.logout.bind(authController));
    protectedRoutes.get("/me", authController.me.bind(authController));
  });
}
