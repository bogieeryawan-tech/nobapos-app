import React, { useMemo } from 'react';
import { PromptRecord } from '../../promptTypes';

interface PromptStatsProps {
  records: PromptRecord[];
}

const PromptStats: React.FC<PromptStatsProps> = ({ records }) => {
  const stats = useMemo(() => {
    const total = records.length;
    const statusCounts = {
      draft: 0,
      needs_review: 0,
      approved: 0,
      deprecated: 0,
    } as Record<PromptRecord['status'], number>;
    let guardrailTotal = 0;
    let guardrailCount = 0;
    let averageLatency = 0;
    let latencyCount = 0;

    records.forEach(record => {
      statusCounts[record.status] += 1;
      const latest = record.iterations[record.iterations.length - 1];
      if (latest?.guardrailScore !== undefined) {
        guardrailTotal += latest.guardrailScore;
        guardrailCount += 1;
      }
      if (latest?.latencyMs !== undefined) {
        averageLatency += latest.latencyMs;
        latencyCount += 1;
      }
    });

    const approvedPercentage = total === 0 ? 0 : Math.round((statusCounts.approved / total) * 100);
    const guardrailAverage = guardrailCount === 0 ? 0 : Math.round(guardrailTotal / guardrailCount);
    const latencyAverage = latencyCount === 0 ? 0 : Math.round(averageLatency / latencyCount);

    return {
      total,
      statusCounts,
      approvedPercentage,
      guardrailAverage,
      latencyAverage,
    };
  }, [records]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Total Eksperimen</p>
        <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.total}</p>
        <p className="mt-2 text-xs text-gray-500">{stats.statusCounts.needs_review} menunggu review, {stats.statusCounts.deprecated} deprecated.</p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Kesiapan Produksi</p>
        <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.approvedPercentage}%</p>
        <p className="mt-2 text-xs text-gray-500">{stats.statusCounts.approved} prompt telah disetujui.</p>
      </div>
      <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Rata-rata Guardrail</p>
        <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.guardrailAverage}</p>
        <p className="mt-2 text-xs text-gray-500">Mengukur kesehatan compliance eksperimen.</p>
      </div>
      <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-500">Latency Rata-rata</p>
        <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.latencyAverage} ms</p>
        <p className="mt-2 text-xs text-gray-500">Berdasarkan iterasi terbaru setiap eksperimen.</p>
      </div>
    </div>
  );
};

export default PromptStats;
