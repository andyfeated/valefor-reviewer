export type ProviderName = 'github' | 'gitlab'

type OAuthConfig = {
  clientId: string
  oauthUrl: string
  redirectUri: string
  scope: string
}

export default class OAuthService {
  private readonly providerConfig: Record<ProviderName, OAuthConfig> = {
    gitlab: {
      clientId: import.meta.env.VITE_GITLAB_CLIENT_ID,
      oauthUrl: import.meta.env.VITE_GITLAB_OAUTH_URL,
      scope: import.meta.env.VITE_GITLAB_SCOPES,
      redirectUri: import.meta.env.VITE_CALLBACK_URL,
    },
    github: {
      clientId: import.meta.env.VITE_GITLAB_CLIENT_ID,
      oauthUrl: import.meta.env.VITE_GITLAB_OAUTH_URL,
      scope: import.meta.env.VITE_GITLAB_SCOPES,
      redirectUri: import.meta.env.VITE_CALLBACK_URL,
    },
  }

  async buildOauthUrl(provider: ProviderName): Promise<string> {
    const verifier = this.generateCodeVerifier()
    const challenge = await this.generateCodeChallenge(verifier)

    const state = this.generateState({ provider: 'gitlab' })
    const config = this.providerConfig[provider]

    localStorage.setItem(`${provider}_code_verifier`, verifier)

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
    })

    const url = `${config.oauthUrl}?${params.toString()}`

    return url
  }

  private generateState(extraState: Record<string, any> = {}) {
    const raw = {
      nonce: crypto.randomUUID(),
      ...extraState,
    }

    const encodedState = btoa(JSON.stringify(raw))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')

    return encodedState
  }

  private generateCodeVerifier(length: number = 64): string {
    const arrayBuffer = new Uint8Array(length)
    crypto.getRandomValues(arrayBuffer)

    const verifier = this.base64UrlEncode(arrayBuffer)
    return verifier
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // string to base64
    const encoder = new TextEncoder()
    const encodedString = encoder.encode(codeVerifier)

    // hash base64
    const digest = await crypto.subtle.digest('SHA-256', encodedString)

    // hashed data to array buffer
    const arrayBuffer = new Uint8Array(digest)
    const codeChallenge = this.base64UrlEncode(arrayBuffer)

    return codeChallenge
  }

  private base64UrlEncode(buffer: Uint8Array) {
    return btoa(String.fromCharCode(...buffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
}
