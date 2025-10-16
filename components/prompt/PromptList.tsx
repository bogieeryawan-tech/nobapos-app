import React from 'react';
import { PromptRecord } from '../../promptTypes';

interface PromptListProps {
  records: PromptRecord[];
  onSelect: (record: PromptRecord) => void;
  selectedId: string | null;
}

const statusStyles: Record<PromptRecord['status'], string> = {
  draft: 'bg-gray-100 text-gray-600',
  needs_review: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  deprecated: 'bg-rose-100 text-rose-700',
};

const PromptList: React.FC<PromptListProps> = ({ records, onSelect, selectedId }) => {
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        Belum ada dokumentasi prompt yang sesuai filter. Tambahkan eksperimen baru atau ubah filter pencarian.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {records.map(record => {
        const latestIteration = record.iterations[record.iterations.length - 1];
        const statusLabel = record.status.replace('_', ' ');
        return (
          <button
            key={record.id}
            onClick={() => onSelect(record)}
            className={`text-left rounded-2xl border px-5 py-4 transition shadow-sm hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              selectedId === record.id ? 'border-indigo-300 ring-2 ring-indigo-200' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[record.status]}`}>
                  {statusLabel}
                </span>
              </div>
              {record.rating && (
                <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                  ★
                  <span>{record.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">{record.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{record.goal || record.useCase}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div>
                <p className="font-medium text-gray-900">Model</p>
                <p>{record.model}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Terakhir diperbarui</p>
                <p>{new Date(record.updatedAt).toLocaleString('id-ID')}</p>
              </div>
              {latestIteration.guardrailScore !== undefined && (
                <div>
                  <p className="font-medium text-gray-900">Skor Guardrail</p>
                  <p>{latestIteration.guardrailScore}/100</p>
                </div>
              )}
              {latestIteration.latencyMs !== undefined && (
                <div>
                  <p className="font-medium text-gray-900">Latency</p>
                  <p>{latestIteration.latencyMs} ms</p>
                </div>
              )}
            </div>

            <div className="mt-4 h-24 overflow-hidden rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
              <p className="font-medium text-gray-700">Insight Terbaru</p>
              <p>{latestIteration.evaluation || 'Belum ada catatan evaluasi'}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {record.tags.map(tag => (
                <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  #{tag}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PromptList;
