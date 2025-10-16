import React, { useMemo } from 'react';
import type { Branch, CompletedOrder, MenuItem } from '../types';
import { generateAIInsights, type AIInsight, type InsightConfidence } from '../services/insightsAI';
import Icon from './Icon';

interface AIInsightsPanelProps {
  orders: CompletedOrder[];
  menuItems: MenuItem[];
  branches: Branch[];
}

const confidenceConfig: Record<InsightConfidence, { label: string; className: string; icon: string }> = {
  high: {
    label: 'Kepercayaan Tinggi',
    className: 'bg-green-100 text-green-800 border border-green-200',
    icon: 'sparkles',
  },
  medium: {
    label: 'Kepercayaan Sedang',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    icon: 'bulb',
  },
  low: {
    label: 'Perlu Validasi',
    className: 'bg-gray-100 text-gray-700 border border-gray-200',
    icon: 'info',
  },
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ orders, menuItems, branches }) => {
  const insights = useMemo<AIInsight[]>(() => {
    return generateAIInsights({ orders, menuItems, branches });
  }, [orders, menuItems, branches]);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-orange-100/70">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
            <Icon name="sparkles" className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Smart Insights</h2>
            <p className="text-xs text-gray-500">Analisis otomatis dari 30 hari transaksi terakhir</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Icon name="refresh" className="w-4 h-4" />
          <span>Diperbarui realtime saat data berubah</span>
        </div>
      </header>

      <div className="px-6 py-5">
        {insights.length === 0 ? (
          <div className="text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 flex items-center gap-3">
            <Icon name="info" className="w-5 h-5 text-gray-400" />
            <span>Belum cukup data untuk menghasilkan insight. Mulailah mencatat transaksi untuk melihat rekomendasi pintar.</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {insights.map(insight => {
              const badge = confidenceConfig[insight.confidence];
              return (
                <li key={insight.id} className="rounded-lg border border-gray-100 hover:border-orange-200 transition-colors bg-white/60 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3 justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name={badge.icon} className="w-5 h-5 text-orange-500" />
                        <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
                      </div>
                      <span className={`text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    {insight.metric && (
                      <p className="mt-2 text-xs font-semibold text-orange-600 bg-orange-50 inline-flex px-3 py-1 rounded-full">
                        {insight.metric}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                      {insight.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AIInsightsPanel;
