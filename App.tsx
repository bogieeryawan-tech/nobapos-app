import React, { useEffect, useMemo, useState } from 'react';
import PromptEntryForm from './components/prompt/PromptEntryForm';
import PromptFilters from './components/prompt/PromptFilters';
import PromptList from './components/prompt/PromptList';
import PromptDetailPanel from './components/prompt/PromptDetailPanel';
import PromptStats from './components/prompt/PromptStats';
import {
  PromptFilterState,
  PromptFormValues,
  PromptIteration,
  PromptIterationInput,
  PromptRecord,
  PromptStatus,
} from './promptTypes';
import { loadPromptRecords, savePromptRecords } from './utils/promptStorage';
import { seedPromptRecords } from './utils/promptSeed';

const HIGGSFIELD_MODELS = [
  'Higgsfield Gemini V.5 Ultra',
  'Higgsfield Orchestrator',
  'Higgsfield Compliance Shield',
  'Higgsfield Dialogue Studio',
  'Higgsfield Vision Crafter',
  'Higgsfield Agentic Flow',
];

const defaultFilters: PromptFilterState = {
  searchTerm: '',
  status: 'all',
  tag: 'all',
  model: 'all',
  sortBy: 'recent',
};

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const getInitialRecords = (): PromptRecord[] => {
  const stored = loadPromptRecords();
  if (stored.length > 0) {
    return stored;
  }
  const seeded = seedPromptRecords();
  if (typeof window !== 'undefined') {
    savePromptRecords(seeded);
  }
  return seeded;
};

const App: React.FC = () => {
  const [records, setRecords] = useState<PromptRecord[]>(getInitialRecords);
  const [filters, setFilters] = useState<PromptFilterState>(defaultFilters);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedRecordId && records.length > 0) {
      setSelectedRecordId(records[0].id);
    }
  }, [records, selectedRecordId]);

  useEffect(() => {
    savePromptRecords(records);
  }, [records]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    records.forEach(record => record.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const availableModels = useMemo(() => {
    const modelSet = new Set(records.map(record => record.model));
    HIGGSFIELD_MODELS.forEach(model => modelSet.add(model));
    return Array.from(modelSet);
  }, [records]);

  const filteredRecords = useMemo(() => {
    const search = filters.searchTerm.toLowerCase();
    const sortBy = filters.sortBy;

    const result = records.filter(record => {
      const matchStatus = filters.status === 'all' || record.status === filters.status;
      const matchModel = filters.model === 'all' || record.model === filters.model;
      const matchTag = filters.tag === 'all' || record.tags.includes(filters.tag);
      const latest = record.iterations[record.iterations.length - 1];
      const haystack = [
        record.title,
        record.goal,
        record.useCase,
        record.owner,
        record.tags.join(' '),
        latest?.prompt ?? '',
        latest?.response ?? '',
      ]
        .join(' ')
        .toLowerCase();
      const matchSearch = search === '' || haystack.includes(search);
      return matchStatus && matchModel && matchTag && matchSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      if (sortBy === 'guardrail') {
        const guardrailA = a.iterations[a.iterations.length - 1]?.guardrailScore ?? 0;
        const guardrailB = b.iterations[b.iterations.length - 1]?.guardrailScore ?? 0;
        return guardrailB - guardrailA;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filters, records]);

  useEffect(() => {
    if (filteredRecords.length === 0) {
      return;
    }
    const existsInFiltered = filteredRecords.some(record => record.id === selectedRecordId);
    if (!existsInFiltered) {
      setSelectedRecordId(filteredRecords[0].id);
    }
  }, [filteredRecords, selectedRecordId]);

  const selectedRecord = useMemo(
    () => records.find(record => record.id === selectedRecordId) ?? null,
    [records, selectedRecordId],
  );

  const topTags = useMemo(() => {
    const counter = new Map<string, number>();
    records.forEach(record => {
      record.tags.forEach(tag => {
        counter.set(tag, (counter.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [records]);

  const handleCreateRecord = (values: PromptFormValues) => {
    const createdAt = new Date().toISOString();
    const iteration: PromptIteration = {
      id: generateId('iteration'),
      createdAt,
      prompt: values.prompt,
      response: values.response,
      evaluation: values.evaluation,
      guardrailScore: values.guardrailScore,
      latencyMs: values.latencyMs,
      temperature: values.temperature,
      topP: values.topP,
      variables: values.variables,
    };

    const newRecord: PromptRecord = {
      id: generateId('prompt'),
      title: values.title,
      goal: values.goal,
      useCase: values.useCase,
      status: values.status,
      model: values.model,
      owner: values.owner,
      tags: values.tags,
      dataset: values.dataset,
      rating: values.rating,
      notes: values.notes,
      createdAt,
      updatedAt: createdAt,
      iterations: [iteration],
    };

    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecordId(newRecord.id);
  };

  const handleStatusChange = (id: string, status: PromptStatus) => {
    setRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, status, updatedAt: new Date().toISOString() } : record,
      ),
    );
  };

  const handleRatingChange = (id: string, rating: number) => {
    if (Number.isNaN(rating)) {
      return;
    }
    setRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, rating, updatedAt: new Date().toISOString() } : record,
      ),
    );
  };

  const handleAddIteration = (id: string, iterationInput: PromptIterationInput) => {
    const createdAt = new Date().toISOString();
    const newIteration: PromptIteration = {
      id: generateId('iteration'),
      createdAt,
      prompt: iterationInput.prompt,
      response: iterationInput.response,
      evaluation: iterationInput.evaluation,
      guardrailScore: iterationInput.guardrailScore,
      latencyMs: iterationInput.latencyMs,
      temperature: iterationInput.temperature,
      topP: iterationInput.topP,
      variables: iterationInput.variables,
    };

    setRecords(prev =>
      prev.map(record =>
        record.id === id
          ? {
              ...record,
              iterations: [...record.iterations, newIteration],
              updatedAt: createdAt,
            }
          : record,
      ),
    );
  };

  const filteredSelectedRecord = useMemo(() => {
    if (!selectedRecord) {
      return null;
    }
    const match = filteredRecords.some(record => record.id === selectedRecord.id);
    return match ? selectedRecord : null;
  }, [filteredRecords, selectedRecord]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Higgsfield AI</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">
              Prompt Intelligence Hub
            </h1>
            <p className="mt-4 text-base text-indigo-100">
              Dokumentasikan setiap eksperimen prompt Higgsfield, ukur kualitas guardrail, dan pastikan tim memiliki single source of truth untuk iterasi yang siap produksi.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-6 text-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">Tag Paling Aktif</p>
            <div className="flex flex-wrap gap-2">
              {topTags.length === 0 && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Belum ada data</span>
              )}
              {topTags.map(([tag, count]) => (
                <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  #{tag} · {count}
                </span>
              ))}
            </div>
            <p className="text-xs text-indigo-100">Data tersinkron otomatis setiap kali ada iterasi baru.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        <PromptStats records={records} />

        <div className="space-y-6">
          <PromptFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
            availableModels={availableModels}
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <PromptList
                records={filteredRecords}
                selectedId={filteredSelectedRecord?.id ?? null}
                onSelect={record => setSelectedRecordId(record.id)}
              />
            </div>
            <div className="min-h-[500px]">
              <PromptDetailPanel
                record={filteredSelectedRecord}
                onClose={() => setSelectedRecordId(null)}
                onStatusChange={handleStatusChange}
                onRatingChange={handleRatingChange}
                onAddIteration={handleAddIteration}
              />
            </div>
          </div>
        </div>

        <PromptEntryForm onCreate={handleCreateRecord} suggestedModels={availableModels} />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Higgsfield AI. Prompt intelligence built for generative teams.</p>
          <div className="flex gap-4">
            <span>Mode penyimpanan: Local only</span>
            <span>Sinkronisasi realtime antar squad segera hadir.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
