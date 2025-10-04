import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the Keycloak issuer URL from environment
    const keycloakIssuer = process.env.AUTH_KEYCLOACK_ISSUER;
    
    if (!keycloakIssuer) {
      // If Keycloak is not configured, just redirect to home
      return res.redirect(302, '/');
    }

    // Construct the Keycloak logout URL
    const baseUrl = process.env.NEXTAUTH_URL || process.env.PUBLIC_URL || 'http://localhost:3005';
    const logoutUrl = new URL(`${keycloakIssuer}/protocol/openid-connect/logout`);
    
    // Add the redirect URI parameter so Keycloak knows where to send the user after logout
    logoutUrl.searchParams.set('post_logout_redirect_uri', baseUrl);
    
    // Optionally, you can add client_id if needed
    if (process.env.AUTH_KEYCLOACK_ID) {
      logoutUrl.searchParams.set('client_id', process.env.AUTH_KEYCLOACK_ID);
    }

    // Redirect to Keycloak logout
    return res.redirect(302, logoutUrl.toString());
  } catch (error) {
    console.error('Error during Keycloak logout:', error);
    // If there's an error, redirect to home
    return res.redirect(302, '/');
  }
}

