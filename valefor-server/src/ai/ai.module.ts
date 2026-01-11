import { Module } from '@nestjs/common';
import { OpenRouterStrategy } from './llm-client/open-router.strategy';
import { AIService } from './ai.service';

@Module({
  providers: [OpenRouterStrategy, AIService],
  exports: [OpenRouterStrategy, AIService],
})
export class AIModule {}
