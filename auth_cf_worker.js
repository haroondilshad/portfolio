// Cloudflare Worker for Decap CMS GitHub OAuth
// Deploy this to Cloudflare Workers with custom domain auth.haroondilshad.com

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // OAuth authorization endpoint
    if (url.pathname === '/auth') {
      const clientId = env.GITHUB_CLIENT_ID;
      const redirectUri = `${url.origin}/callback`;
      const scope = 'repo,user';
      const state = url.searchParams.get('state') || 'default_state';
      
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      
      return Response.redirect(authUrl, 302);
    }

    // OAuth callback endpoint
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code) {
        return new Response('Authorization failed: No code provided', { status: 400 });
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        // Return success page with token for Decap CMS
        const successPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Successful</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    .success { color: #28a745; }
  </style>
</head>
<body>
  <h1 class="success">Authorization Successful!</h1>
  <p>You can now close this window and return to the CMS.</p>
  <script>
    console.log('OAuth callback page loaded');
    console.log('window.opener exists:', !!window.opener);
    
    // Send token back to parent window (Decap CMS)
    if (window.opener) {
      console.log('Sending postMessage to parent window');
      
      // CRITICAL: Send the "authorizing:github" message first (what CMS expects)
      console.log('Sending authorizing message...');
      window.opener.postMessage('authorizing:github', 'https://haroondilshad.com');
      
      // Then send the success message with token
      const successMessage = 'authorization:github:success:{"token":"${tokenData.access_token}","provider":"github"}';
      console.log('Sending success message:', successMessage);
      window.opener.postMessage(successMessage, 'https://haroondilshad.com');
      
      console.log('Messages sent, closing window in 2 seconds...');
      setTimeout(() => {
        window.close();
      }, 2000);
    } else {
      console.error('No window.opener found - popup was not opened by parent window');
    }
  </script>
</body>
</html>`;

        return new Response(successPage, {
          headers: { 
            'Content-Type': 'text/html',
            ...corsHeaders
          },
        });

      } catch (error) {
        console.error('OAuth error:', error);
        return new Response(`OAuth error: ${error.message}`, { 
          status: 500,
          headers: corsHeaders
        });
      }
    }

    // Default response
    return new Response('Decap CMS OAuth Provider\nEndpoints: /auth, /callback', {
      headers: { 
        'Content-Type': 'text/plain',
        ...corsHeaders
      },
    });
  },
};
