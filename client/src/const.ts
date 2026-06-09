export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// This must NEVER throw, because it is evaluated eagerly inside useAuth() on
// every render (including the landing page). In native/Android (Capacitor)
// builds the OAuth env vars may be missing, which previously caused
// `new URL("undefined/app-auth")` to throw "Invalid URL" and crash the app.
export const getLoginUrl = () => {
  try {
    const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
    const appId = import.meta.env.VITE_APP_ID;

    // Guard: if the portal URL is not configured (e.g. native APK build where
    // build-time secrets are absent), fall back to a safe in-app route instead
    // of constructing an invalid URL.
    if (!oauthPortalUrl) {
      return "/";
    }

    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "";
    const redirectUri = `${origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId ?? "");
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    // Never let a malformed env value crash the whole app.
    console.warn("[getLoginUrl] Failed to build login URL:", error);
    return "/";
  }
};
