export interface LLMClientStrategy {
  sendRequest(prompt: string): Promise<string>;
}
