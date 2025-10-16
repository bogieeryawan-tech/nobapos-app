import { PromptRecord } from '../promptTypes';

const STORAGE_KEY = 'higgsfield-prompt-notebook';

export const loadPromptRecords = (): PromptRecord[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as PromptRecord[];
    }

    return [];
  } catch (error) {
    console.warn('Failed to load prompt records from localStorage', error);
    return [];
  }
};

export const savePromptRecords = (records: PromptRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to persist prompt records to localStorage', error);
  }
};
