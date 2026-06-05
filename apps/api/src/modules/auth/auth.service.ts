import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { RegisterInput, LoginInput } from "./auth.schemas";
import { env } from "../../infrastructure/env";
import { encrypt } from "../../utils/encryption";

export class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !user.passwordHash) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        githubId: true,
        createdAt: true,
      },
    });
  }

  async handleGithubCallback(code: string) {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      throw new Error("GitHub OAuth is not configured");
    }

    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error) {
      throw new Error(tokenData.error_description || "Failed to authenticate with GitHub");
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const githubUser = await userResponse.json() as any;
    if (!githubUser.id) {
      throw new Error("Failed to fetch GitHub profile");
    }

    // 3. Fetch user email
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      const emails = await emailResponse.json() as any[];
      const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
      email = primaryEmail?.email;
    }

    if (!email) {
      throw new Error("No email associated with this GitHub account");
    }

    // 4. Find or create user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ githubId: String(githubUser.id) }, { email }],
      },
    });

    let user;
    if (existingUser) {
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          githubId: String(githubUser.id),
          githubToken: encrypt(accessToken),
          avatarUrl: githubUser.avatar_url,
          name: existingUser.name || githubUser.name || githubUser.login,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name: githubUser.name || githubUser.login,
          githubId: String(githubUser.id),
          githubToken: encrypt(accessToken),
          avatarUrl: githubUser.avatar_url,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
    }

    return user;
  }
}

export const authService = new AuthService();
