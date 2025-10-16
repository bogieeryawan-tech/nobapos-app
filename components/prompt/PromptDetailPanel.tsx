import React, { useMemo, useState } from 'react';
import {
  PromptIterationInput,
  PromptRecord,
  PromptStatus,
  PromptVariable,
} from '../../promptTypes';

interface PromptDetailPanelProps {
  record: PromptRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, status: PromptStatus) => void;
  onRatingChange: (id: string, rating: number) => void;
  onAddIteration: (id: string, iteration: PromptIterationInput) => void;
}

const statusLabels: Record<PromptStatus, string> = {
  draft: 'Draft',
  needs_review: 'Butuh Review',
  approved: 'Sudah Disetujui',
  deprecated: 'Tidak Dipakai',
};

const defaultIteration: PromptIterationInput = {
  prompt: '',
  response: '',
  evaluation: '',
  guardrailScore: 85,
  latencyMs: 2000,
  temperature: 0.2,
  topP: 0.9,
  variables: [],
};

const PromptDetailPanel: React.FC<PromptDetailPanelProps> = ({
  record,
  onClose,
  onStatusChange,
  onRatingChange,
  onAddIteration,
}) => {
  const [iterationForm, setIterationForm] = useState<PromptIterationInput>(defaultIteration);
  const [showIterationForm, setShowIterationForm] = useState(false);

  const latestIteration = useMemo(() => {
    if (!record || record.iterations.length === 0) return null;
    return record.iterations[record.iterations.length - 1];
  }, [record]);

  if (!record) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-sm text-gray-500">
        Pilih salah satu eksperimen prompt untuk melihat detail lengkapnya.
      </div>
    );
  }

  const handleIterationFieldChange = <K extends keyof PromptIterationInput>(key: K, value: PromptIterationInput[K]) => {
    setIterationForm(prev => ({ ...prev, [key]: value }));
  };

  const handleIterationNumberChange = (key: keyof Pick<PromptIterationInput, 'temperature' | 'topP' | 'guardrailScore' | 'latencyMs'>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      if (raw === '') {
        handleIterationFieldChange(key, undefined as never);
        return;
      }
      const parsed = Number(raw);
      handleIterationFieldChange(key, Number.isNaN(parsed) ? undefined as never : (parsed as never));
    };

  const updateVariable = (index: number, key: keyof PromptVariable, value: string) => {
    setIterationForm(prev => ({
      ...prev,
      variables: prev.variables.map((variable, idx) =>
        idx === index ? { ...variable, [key]: value } : variable,
      ),
    }));
  };

  const addVariable = () => {
    setIterationForm(prev => ({
      ...prev,
      variables: [...prev.variables, { key: '', value: '' }],
    }));
  };

  const removeVariable = (index: number) => {
    setIterationForm(prev => ({
      ...prev,
      variables: prev.variables.filter((_, idx) => idx !== index),
    }));
  };

  const resetIterationForm = () => {
    setIterationForm(defaultIteration);
    setShowIterationForm(false);
  };

  const submitIteration = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!record) return;
    if (!iterationForm.prompt.trim() || !iterationForm.response.trim()) {
      return;
    }

    const cleanedVariables = iterationForm.variables
      .filter(variable => variable.key.trim() || variable.value.trim())
      .map(variable => ({ key: variable.key.trim(), value: variable.value.trim() }));

    onAddIteration(record.id, {
      ...iterationForm,
      prompt: iterationForm.prompt.trim(),
      response: iterationForm.response.trim(),
      evaluation: iterationForm.evaluation.trim(),
      variables: cleanedVariables,
    });
    resetIterationForm();
  };

  const copyToClipboard = async (text: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.warn('Gagal menyalin ke clipboard', error);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Higgsfield Prompt Atlas</p>
          <h2 className="mt-2 text-xl font-semibold text-gray-900">{record.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{record.goal || record.useCase}</p>
        </div>
        <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Status</p>
            <select
              value={record.status}
              onChange={event => onStatusChange(record.id, event.target.value as PromptStatus)}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500">Rating Internal</p>
            <input
              type="number"
              min={1}
              max={5}
              step={0.5}
              value={record.rating ?? ''}
              onChange={event => onRatingChange(record.id, Number(event.target.value))}
              placeholder="1-5"
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Model Higgsfield</p>
            <p className="mt-1 font-semibold text-gray-900">{record.model}</p>
            <p className="mt-2 text-xs text-gray-500">Owner: <span className="font-medium text-gray-900">{record.owner}</span></p>
            {record.dataset && <p className="mt-1 text-xs text-gray-500">Dataset: {record.dataset}</p>}
            <p className="mt-2 text-xs text-gray-500">Terakhir diperbarui: {new Date(record.updatedAt).toLocaleString('id-ID')}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tag & Use Case</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {record.tags.map(tag => (
                <span key={tag} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">Use Case: <span className="font-medium text-gray-900">{record.useCase || '-'}</span></p>
            {record.notes && (
              <p className="mt-3 text-xs text-gray-500">Catatan: <span className="font-medium text-gray-900">{record.notes}</span></p>
            )}
          </div>
        </section>

        {latestIteration && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Iterasi Terakhir</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Prompt</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(latestIteration.prompt)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Salin
                  </button>
                </div>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-900/90 px-3 py-3 text-xs leading-relaxed text-gray-100">
                  {latestIteration.prompt}
                </pre>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Respons</p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(latestIteration.response)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Salin
                  </button>
                </div>
                <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-900/90 px-3 py-3 text-xs leading-relaxed text-emerald-100">
                  {latestIteration.response}
                </pre>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 text-xs text-gray-600">
              {latestIteration.guardrailScore !== undefined && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="font-medium text-gray-900">Skor Guardrail</p>
                  <p className="mt-1 text-lg font-semibold text-indigo-600">{latestIteration.guardrailScore}/100</p>
                </div>
              )}
              {latestIteration.latencyMs !== undefined && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="font-medium text-gray-900">Latency</p>
                  <p className="mt-1 text-lg font-semibold text-indigo-600">{latestIteration.latencyMs} ms</p>
                </div>
              )}
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="font-medium text-gray-900">Parameter Sampling</p>
                <p className="mt-1">Temperature: {latestIteration.temperature}</p>
                {latestIteration.topP !== undefined && <p>Top P: {latestIteration.topP}</p>}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Insight & Evaluasi</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{latestIteration.evaluation || 'Belum ada evaluasi'}</p>
              {latestIteration.variables.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Variabel yang digunakan</p>
                  <div className="mt-2 grid gap-2 text-xs">
                    {latestIteration.variables.map(variable => (
                      <div key={variable.key + variable.value} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <span className="font-medium text-gray-700">{variable.key}</span>
                        <span className="text-gray-600">{variable.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Riwayat Iterasi</h3>
          <div className="space-y-4">
            {record.iterations.map(iteration => (
              <div key={iteration.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(iteration.createdAt).toLocaleString('id-ID')}</span>
                  {iteration.guardrailScore !== undefined && (
                    <span className="font-medium text-indigo-600">Guardrail: {iteration.guardrailScore}</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">{iteration.evaluation || 'Tidak ada catatan evaluasi.'}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-900/90 px-3 py-3 text-xs text-gray-100 whitespace-pre-wrap">
                    {iteration.prompt}
                  </div>
                  <div className="rounded-lg bg-slate-900/90 px-3 py-3 text-xs text-emerald-100 whitespace-pre-wrap">
                    {iteration.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-indigo-700">Tambah Iterasi / Eksperimen Baru</h3>
              <p className="text-xs text-indigo-600">Catat variasi prompt baru untuk eksperimen yang sama dan bandingkan hasilnya.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowIterationForm(prev => !prev)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              {showIterationForm ? 'Tutup Form' : 'Tambah Iterasi'}
            </button>
          </div>

          {showIterationForm && (
            <form onSubmit={submitIteration} className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-indigo-700">Temperature</label>
                  <input
                    type="number"
                    step={0.05}
                    min={0}
                    max={1}
                    value={iterationForm.temperature}
                    onChange={handleIterationNumberChange('temperature')}
                    className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-indigo-700">Top P</label>
                  <input
                    type="number"
                    step={0.05}
                    min={0}
                    max={1}
                    value={iterationForm.topP ?? ''}
                    onChange={handleIterationNumberChange('topP')}
                    className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-indigo-700">Guardrail Score</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={iterationForm.guardrailScore ?? ''}
                    onChange={handleIterationNumberChange('guardrailScore')}
                    className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-indigo-700">Latency (ms)</label>
                  <input
                    type="number"
                    min={0}
                    value={iterationForm.latencyMs ?? ''}
                    onChange={handleIterationNumberChange('latencyMs')}
                    className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-indigo-700">Prompt</label>
                <textarea
                  value={iterationForm.prompt}
                  onChange={event => handleIterationFieldChange('prompt', event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-indigo-700">Respons</label>
                <textarea
                  value={iterationForm.response}
                  onChange={event => handleIterationFieldChange('response', event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-indigo-700">Catatan Evaluasi</label>
                <textarea
                  value={iterationForm.evaluation}
                  onChange={event => handleIterationFieldChange('evaluation', event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-indigo-700">Variabel</label>
                  <button
                    type="button"
                    onClick={addVariable}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    + Variabel
                  </button>
                </div>
                <div className="space-y-2">
                  {iterationForm.variables.map((variable, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr,1fr,auto]">
                      <input
                        type="text"
                        value={variable.key}
                        onChange={event => updateVariable(index, 'key', event.target.value)}
                        placeholder="Nama"
                        className="rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={variable.value}
                        onChange={event => updateVariable(index, 'value', event.target.value)}
                        placeholder="Nilai"
                        className="rounded-lg border border-indigo-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariable(index)}
                        className="text-xs text-rose-500 hover:text-rose-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  {iterationForm.variables.length === 0 && (
                    <div className="rounded-lg border border-dashed border-indigo-200 bg-white px-3 py-2 text-center text-xs text-indigo-600">
                      Belum ada variabel yang ditambahkan.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetIterationForm}
                  className="rounded-lg border border-indigo-200 px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Simpan Iterasi
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default PromptDetailPanel;
