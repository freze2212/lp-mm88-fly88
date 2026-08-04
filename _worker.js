// Cloudflare Pages / Workers Advanced Serverless Handler for MM88 Landing Page
import DOMAIN_MAPPINGS from './domains.json';

const DEFAULT_REDIRECT = "https://mm88e9e22qc.mm6799.com/register.html";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Get current host from request header
    const rawHost = request.headers.get("host") || url.hostname || "";
    const cleanHost = rawHost.replace(/^www\./i, "").split(":")[0].toLowerCase();

    // Look up domain target URL in domains.json
    let targetUrl = DEFAULT_REDIRECT;
    if (DOMAIN_MAPPINGS && DOMAIN_MAPPINGS[cleanHost]) {
      const entry = DOMAIN_MAPPINGS[cleanHost];
      if (typeof entry === 'string') {
        targetUrl = entry;
      } else if (entry && entry.main_url) {
        targetUrl = entry.main_url;
      } else if (entry && entry.target_url) {
        targetUrl = entry.target_url;
      }
    }

    // Direct endpoint for domain configuration
    if (path === '/api/domain-config') {
      return new Response(JSON.stringify({
        success: true,
        host: cleanHost,
        targetUrl: targetUrl
      }), {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Dynamic config.js response based on request domain
    if (path === '/config.js') {
      const configJs = `/* Dynamically generated for host: ${cleanHost} */\nwindow.REDIRECT_URL = ${JSON.stringify(targetUrl)};`;
      return new Response(configJs, {
        headers: {
          'Content-Type': 'application/javascript;charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // For all static assets, pass through to Cloudflare Pages static asset handler
    return env.ASSETS ? env.ASSETS.fetch(request) : fetch(request);
  }
};
