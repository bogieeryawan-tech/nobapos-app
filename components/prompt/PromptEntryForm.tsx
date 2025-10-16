import React, { useState } from 'react';
import { PromptFormValues, PromptVariable, PromptStatus } from '../../promptTypes';

interface PromptEntryFormProps {
  onCreate: (values: PromptFormValues) => void;
  suggestedModels: string[];
}

const statusLabels: Record<PromptStatus, string> = {
  draft: 'Draft',
  needs_review: 'Butuh Review',
  approved: 'Sudah Disetujui',
  deprecated: 'Tidak Dipakai',
};

const defaultFormState: PromptFormValues = {
  title: '',
  goal: '',
  useCase: '',
  status: 'draft',
  model: 'Higgsfield Gemini V.5 Ultra',
  owner: '',
  tags: [],
  dataset: '',
  rating: 4,
  notes: '',
  prompt: '',
  response: '',
  evaluation: '',
  temperature: 0.2,
  topP: 0.9,
  guardrailScore: 90,
  latencyMs: 2000,
  variables: [],
};

const PromptEntryForm: React.FC<PromptEntryFormProps> = ({ onCreate, suggestedModels }) => {
  const [form, setForm] = useState<PromptFormValues>(defaultFormState);
  const [tagInput, setTagInput] = useState('');

  const handleFieldChange = <K extends keyof PromptFormValues>(key: K, value: PromptFormValues[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: keyof Pick<PromptFormValues, 'temperature' | 'topP' | 'guardrailScore' | 'latencyMs' | 'rating'>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      if (rawValue === '') {
        handleFieldChange(key, undefined as never);
        return;
      }
      const parsed = Number(rawValue);
      handleFieldChange(key, Number.isNaN(parsed) ? undefined as never : (parsed as never));
    };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || form.tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    setForm(prev => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleVariableChange = (index: number, key: keyof PromptVariable, value: string) => {
    setForm(prev => ({
      ...prev,
      variables: prev.variables.map((variable, idx) =>
        idx === index ? { ...variable, [key]: value } : variable,
      ),
    }));
  };

  const addVariable = () => {
    setForm(prev => ({ ...prev, variables: [...prev.variables, { key: '', value: '' }] }));
  };

  const removeVariable = (index: number) => {
    setForm(prev => ({
      ...prev,
      variables: prev.variables.filter((_, idx) => idx !== index),
    }));
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setTagInput('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.prompt.trim() || !form.response.trim()) {
      return;
    }

    const cleanedVariables = form.variables
      .filter(variable => variable.key.trim() || variable.value.trim())
      .map(variable => ({ key: variable.key.trim(), value: variable.value.trim() }));

    onCreate({
      ...form,
      title: form.title.trim(),
      goal: form.goal.trim(),
      useCase: form.useCase.trim(),
      owner: form.owner.trim() || 'Tim Higgsfield',
      dataset: form.dataset?.trim(),
      notes: form.notes?.trim(),
      prompt: form.prompt.trim(),
      response: form.response.trim(),
      evaluation: form.evaluation.trim(),
      variables: cleanedVariables,
    });

    resetForm();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Catat Eksperimen Prompt Baru</h2>
        <p className="text-sm text-gray-500">Simpan versi terbaik prompt Higgsfield lengkap dengan parameter dan hasil evaluasinya.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Judul Eksperimen</label>
            <input
              type="text"
              value={form.title}
              onChange={event => handleFieldChange('title', event.target.value)}
              placeholder="Contoh: Rangkuman Insight Pelanggan"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Pemilik / Squad</label>
            <input
              type="text"
              value={form.owner}
              onChange={event => handleFieldChange('owner', event.target.value)}
              placeholder="Tim AI Studio"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tujuan</label>
            <input
              type="text"
              value={form.goal}
              onChange={event => handleFieldChange('goal', event.target.value)}
              placeholder="Apa yang ingin dicapai?"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Use Case</label>
            <input
              type="text"
              value={form.useCase}
              onChange={event => handleFieldChange('useCase', event.target.value)}
              placeholder="Misal: Email follow-up sales"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Model Higgsfield</label>
            <select
              value={form.model}
              onChange={event => handleFieldChange('model', event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {suggestedModels.map(model => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={event => handleFieldChange('status', event.target.value as PromptStatus)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Dataset / Referensi</label>
            <input
              type="text"
              value={form.dataset ?? ''}
              onChange={event => handleFieldChange('dataset', event.target.value)}
              placeholder="Misal: Transcript Webinar 5 April"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Temperature</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={form.temperature}
                onChange={handleNumberChange('temperature')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Top P</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={form.topP ?? ''}
                onChange={handleNumberChange('topP')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Latency (ms)</label>
              <input
                type="number"
                min="0"
                value={form.latencyMs ?? ''}
                onChange={handleNumberChange('latencyMs')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Skor Guardrail</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.guardrailScore ?? ''}
              onChange={handleNumberChange('guardrailScore')}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Rating Internal</label>
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating ?? ''}
              onChange={handleNumberChange('rating')}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tag Eksperimen</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={event => setTagInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Tekan Enter untuk menambahkan tag"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
            >
              Tambah
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {tag}
                <button type="button" className="text-indigo-500" onClick={() => handleRemoveTag(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            value={form.prompt}
            onChange={event => handleFieldChange('prompt', event.target.value)}
            rows={5}
            placeholder="Tuliskan instruksi lengkap yang diberikan ke Higgsfield AI"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Respons</label>
          <textarea
            value={form.response}
            onChange={event => handleFieldChange('response', event.target.value)}
            rows={5}
            placeholder="Hasil yang diterima dari Higgsfield AI"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Catatan Evaluasi</label>
          <textarea
            value={form.evaluation}
            onChange={event => handleFieldChange('evaluation', event.target.value)}
            rows={4}
            placeholder="Insight, metrik keberhasilan, atau feedback untuk iterasi berikutnya"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Variabel Kontekstual</label>
            <button
              type="button"
              onClick={addVariable}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              + Tambah Variabel
            </button>
          </div>
          <p className="text-xs text-gray-500">Gunakan variabel untuk menyimpan placeholder yang sering berubah seperti persona, bahasa, atau parameter bisnis.</p>
          <div className="space-y-3">
            {form.variables.map((variable, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                <input
                  type="text"
                  value={variable.key}
                  onChange={event => handleVariableChange(index, 'key', event.target.value)}
                  placeholder="Nama variabel"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={variable.value}
                  onChange={event => handleVariableChange(index, 'value', event.target.value)}
                  placeholder="Nilai contoh"
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeVariable(index)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
            ))}
            {form.variables.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-500">
                Belum ada variabel. Tambahkan variabel untuk mendokumentasikan placeholder yang dapat dikustomisasi.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
          <textarea
            value={form.notes ?? ''}
            onChange={event => handleFieldChange('notes', event.target.value)}
            rows={3}
            placeholder="Hal-hal penting untuk tim lain (contoh: batasan penggunaan, dependency eksternal)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Simpan Eksperimen
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptEntryForm;
