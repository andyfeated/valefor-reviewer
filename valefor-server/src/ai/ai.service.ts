import { Injectable } from '@nestjs/common';
import { OpenRouterStrategy } from './llm-client/open-router.strategy';
import { AI_PROMPT_TEMPLATE } from './ai.constants';

@Injectable()
export class AIService {
  private promptTemplate: string;

  constructor(private llmClient: OpenRouterStrategy) {
    this.promptTemplate = AI_PROMPT_TEMPLATE || '';
  }

  async reviewDiffs(diffs: { diff: string; path: string }[]): Promise<string> {
    const prompt = this.promptTemplate.replace(
      '{{ diffs }}',
      JSON.stringify(diffs, null, 2),
    );

    return this.llmClient.sendRequest(prompt);
  }
}
