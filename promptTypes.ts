export type PromptStatus = 'draft' | 'needs_review' | 'approved' | 'deprecated';

export interface PromptVariable {
  key: string;
  value: string;
}

export interface PromptIteration {
  id: string;
  createdAt: string;
  prompt: string;
  response: string;
  evaluation: string;
  guardrailScore?: number;
  latencyMs?: number;
  temperature: number;
  topP?: number;
  variables: PromptVariable[];
}

export interface PromptIterationInput {
  prompt: string;
  response: string;
  evaluation: string;
  guardrailScore?: number;
  latencyMs?: number;
  temperature: number;
  topP?: number;
  variables: PromptVariable[];
}

export interface PromptRecord {
  id: string;
  title: string;
  goal: string;
  useCase: string;
  status: PromptStatus;
  model: string;
  owner: string;
  tags: string[];
  dataset?: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  iterations: PromptIteration[];
}

export interface PromptFilterState {
  searchTerm: string;
  status: PromptStatus | 'all';
  tag: string | 'all';
  model: string | 'all';
  sortBy: 'recent' | 'rating' | 'guardrail';
}

export interface PromptFormValues {
  title: string;
  goal: string;
  useCase: string;
  status: PromptStatus;
  model: string;
  owner: string;
  tags: string[];
  dataset?: string;
  rating?: number;
  notes?: string;
  prompt: string;
  response: string;
  evaluation: string;
  temperature: number;
  topP?: number;
  guardrailScore?: number;
  latencyMs?: number;
  variables: PromptVariable[];
}
