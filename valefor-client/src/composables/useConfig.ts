export function useConfig() {
  const config = {
    apiUrl: window.ENV?.VITE_BASE_API_URL || import.meta.env.VITE_BASE_API_URL,
    clientId: window.ENV?.VITE_GITLAB_CLIENT_ID || import.meta.env.VITE_GITLAB_CLIENT_ID,
    oauthUrl: window.ENV?.VITE_GITLAB_OAUTH_URL || import.meta.env.VITE_GITLAB_OAUTH_URL,
    scope: window.ENV?.VITE_GITLAB_SCOPES || import.meta.env.VITE_GITLAB_SCOPES,
    redirectUri: window.ENV?.VITE_CALLBACK_URL || import.meta.env.VITE_CALLBACK_URL,
  }

  return config
}
