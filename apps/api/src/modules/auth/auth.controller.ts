import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "./auth.service";
import { RegisterSchema, LoginSchema } from "./auth.schemas";
import { successResponse, errorResponse } from "../../infrastructure/api-response";
import { env } from "../../infrastructure/env";

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const input = RegisterSchema.parse(request.body);
    
    try {
      const user = await authService.register(input);
      const token = await reply.jwtSign({ id: user.id, email: user.email, name: user.name });

      reply.setCookie("rosereview_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return reply.send(successResponse({ user, token }, "Registration successful", undefined, request.id));
    } catch (error: any) {
      if (error.message === "User already exists with this email") {
        return reply.status(409).send(errorResponse("CONFLICT", error.message, null, request.id));
      }
      throw error;
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = LoginSchema.parse(request.body);

    try {
      const user = await authService.login(input);
      const token = await reply.jwtSign({ id: user.id, email: user.email, name: user.name });

      reply.setCookie("rosereview_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return reply.send(successResponse({ user, token }, "Login successful", undefined, request.id));
    } catch (error: any) {
      return reply.status(401).send(errorResponse("UNAUTHORIZED", error.message, null, request.id));
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("rosereview_token", { path: "/" });
    return reply.send(successResponse(null, "Logged out successfully", undefined, request.id));
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = await authService.getUserById(request.user.id);
    if (!user) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "User not found", null, request.id));
    }
    return reply.send(successResponse(user, "User profile retrieved", undefined, request.id));
  }

  async githubLogin(request: FastifyRequest, reply: FastifyReply) {
    const clientId = env.GITHUB_CLIENT_ID || "Ov23liarYizusohYEor6";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email,repo`;
    return reply.redirect(githubAuthUrl);
  }

  async githubCallback(request: FastifyRequest<{ Querystring: { code: string } }>, reply: FastifyReply) {
    const { code } = request.query;

    if (!code) {
      return reply.redirect(`${env.FRONTEND_URL}/login?error=missing_code`);
    }

    try {
      const user = await authService.handleGithubCallback(code);
      const token = await reply.jwtSign({ id: user.id, email: user.email, name: user.name });

      reply.setCookie("rosereview_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return reply.redirect(`${env.FRONTEND_URL}/dashboard.html?auth=success`);
    } catch (error: any) {
      return reply.redirect(`${env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
    }
  }
}

export const authController = new AuthController();
