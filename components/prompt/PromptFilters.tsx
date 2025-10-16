import React from 'react';
import { PromptFilterState, PromptStatus } from '../../promptTypes';

interface PromptFiltersProps {
  filters: PromptFilterState;
  onFiltersChange: (filters: PromptFilterState) => void;
  availableTags: string[];
  availableModels: string[];
}

const statusLabels: Record<PromptStatus | 'all', string> = {
  all: 'Semua Status',
  draft: 'Draft',
  needs_review: 'Butuh Review',
  approved: 'Sudah Disetujui',
  deprecated: 'Tidak Dipakai',
};

const sortLabels: Record<PromptFilterState['sortBy'], string> = {
  recent: 'Terbaru',
  rating: 'Rating Tertinggi',
  guardrail: 'Skor Guardrail',
};

const PromptFilters: React.FC<PromptFiltersProps> = ({ filters, onFiltersChange, availableTags, availableModels }) => {
  const handleChange = <K extends keyof PromptFilterState>(key: K, value: PromptFilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Cari Prompt</label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={event => handleChange('searchTerm', event.target.value)}
            placeholder="Cari judul, tag, atau isi prompt"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
          <select
            value={filters.status}
            onChange={event => handleChange('status', event.target.value as PromptFilterState['status'])}
            className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Model</label>
          <select
            value={filters.model}
            onChange={event => handleChange('model', event.target.value as PromptFilterState['model'])}
            className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Semua Model</option>
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Tag</label>
          <select
            value={filters.tag}
            onChange={event => handleChange('tag', event.target.value as PromptFilterState['tag'])}
            className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Semua Tag</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Urutkan</label>
          <select
            value={filters.sortBy}
            onChange={event => handleChange('sortBy', event.target.value as PromptFilterState['sortBy'])}
            className="mt-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default PromptFilters;
