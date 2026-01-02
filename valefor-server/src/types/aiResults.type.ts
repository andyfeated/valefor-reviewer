export type AiResultComment = {
  path: string;
  response: string;
};

export enum AiResultStatus {
  pending = 'pending',
  completed = 'completed',
  error = 'error',
}

export type AiResult = {
  comments: AiResultComment[];
  model: string;
  status: AiResultStatus;
  startedAt: Date;
  completedAt: Date;
  error: string;
};
