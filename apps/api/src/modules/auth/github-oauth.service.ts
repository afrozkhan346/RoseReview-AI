import { env } from "../../infrastructure/env";
import { logger } from "../../infrastructure/logger";

/**
 * Service for handling GitHub OAuth authorization flows.
 * Note: This is a preparation layer for the hackathon MVP. Real OAuth flows 
 * will require configuring GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.
 */
export class GitHubOAuthService {
  /**
   * Generates the GitHub OAuth authorization URL to redirect the user to.
   */
  getAuthorizationUrl(state: string): string {
    const clientId = process.env.GITHUB_CLIENT_ID || "mock_client_id";
    const redirectUri = `${env.APP_URL}/api/auth/github/callback`;
    const scopes = ["read:user", "user:email", "repo", "read:org"];
    
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}&state=${state}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   */
  async exchangeCodeForToken(code: string): Promise<string> {
    logger.info("Exchanging GitHub OAuth code for token");
    
    if (process.env.NODE_ENV !== "production" && !process.env.GITHUB_CLIENT_SECRET) {
      // Mock implementation for local testing without real credentials
      return "mock_github_access_token_12345";
    }

    const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liarYizusohYEor6";
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientSecret) {
      throw new Error("GITHUB_CLIENT_SECRET is missing from environment variables");
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`GitHub token exchange error: ${data.error_description || data.error}`);
    }

    return data.access_token;
  }

  /**
   * Retrieves the authenticated user's profile from GitHub.
   */
  async getGitHubUserProfile(accessToken: string) {
    if (accessToken.startsWith("mock_")) {
      return {
        id: "mock_github_id_999",
        login: "mock-developer",
        email: "developer@example.com",
        avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      };
    }
    
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
    }

    const user = await response.json();

    let email = user.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      if (emailResponse.ok) {
        const emails = await emailResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        if (primaryEmail) {
          email = primaryEmail.email;
        } else if (emails.length > 0) {
          email = emails[0].email;
        }
      }
    }

    return {
      id: String(user.id),
      login: user.login,
      email: email,
      avatar_url: user.avatar_url,
    };
  }
}

export const githubOAuthService = new GitHubOAuthService();
