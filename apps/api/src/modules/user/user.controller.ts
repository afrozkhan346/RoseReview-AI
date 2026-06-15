import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { successResponse, errorResponse } from "../../infrastructure/api-response";
import { z } from "zod";

const OnboardingInputSchema = z.object({
  persona: z.string(),
  onboardingData: z.record(z.any()),
});

export class UserController {
  async saveOnboarding(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const body = OnboardingInputSchema.parse(request.body);

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          isOnboarded: true,
          persona: body.persona,
          onboardingData: body.onboardingData,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isOnboarded: true,
          persona: true,
        }
      });
      return reply.send(successResponse(user, "Onboarding completed successfully", undefined, request.id));
    } catch (error: any) {
      request.server.log.error(error);
      return reply.status(500).send(errorResponse("INTERNAL_SERVER_ERROR", "Failed to save onboarding context", null, request.id));
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const data = request.body as any;

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          onboardingData: data.onboardingData ? data.onboardingData : undefined
        },
        select: {
          id: true,
          email: true,
          name: true,
          isOnboarded: true,
          persona: true,
          onboardingData: true
        }
      });
      return reply.send(successResponse(user, "Profile updated successfully", undefined, request.id));
    } catch (error: any) {
      return reply.status(500).send(errorResponse("INTERNAL_SERVER_ERROR", "Failed to update profile", null, request.id));
    }
  }
}

export const userController = new UserController();
