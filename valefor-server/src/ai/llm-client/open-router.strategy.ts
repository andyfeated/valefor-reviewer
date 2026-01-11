import { LLMClientStrategy } from './llm-client.strategy';

export class OpenRouterStrategy implements LLMClientStrategy {
  private readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(model: string) {
    this.model = model ?? 'mistralai/devstral-2512:free';
    this.apiKey = process.env.OPEN_ROUTER_API_KEY;
    this.baseUrl = process.env.OPEN_ROUTER_URL;
  }

  async sendRequest(prompt: string): Promise<string> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    });

    const data = await res.json();

    return data?.choices?.[0]?.message?.content ?? '';
  }
}
