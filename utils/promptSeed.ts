import { PromptRecord } from '../promptTypes';

const now = () => new Date().toISOString();

export const seedPromptRecords = (): PromptRecord[] => [
  {
    id: 'prompt-1',
    title: 'Rangkuman Riset Pasar Higgsfield',
    goal: 'Meringkas insight utama riset pasar untuk tim pemasaran.',
    useCase: 'Laporan internal mingguan',
    status: 'approved',
    model: 'Higgsfield Gemini V.5 Ultra',
    owner: 'Tim Riset Produk',
    tags: ['riset', 'ringkasan', 'marketing'],
    dataset: 'Survei pelanggan Q1 2025',
    rating: 5,
    notes: 'Memberikan highlight visual dan CTA yang kuat.',
    createdAt: now(),
    updatedAt: now(),
    iterations: [
      {
        id: 'prompt-1-it-1',
        createdAt: now(),
        prompt: 'Buat ringkasan eksekutif dari hasil survei pelanggan Higgsfield AI berikut... ',
        response: 'Ringkasan eksekutif:\n1. Kepuasan pelanggan naik 12%...\n2. ...',
        evaluation: 'Output koheren, CTA kuat, siap dipublikasikan ke leadership.',
        guardrailScore: 94,
        latencyMs: 1800,
        temperature: 0.2,
        topP: 0.9,
        variables: [
          { key: 'target_audience', value: 'Chief Marketing Officer' },
          { key: 'tone', value: 'Percaya diri dan optimistis' }
        ],
      },
    ],
  },
  {
    id: 'prompt-2',
    title: 'Template Prompt Demo Produk',
    goal: 'Membuat narasi demo produk interaktif untuk sesi live Higgsfield.',
    useCase: 'Demo produk live-stream',
    status: 'needs_review',
    model: 'Higgsfield Orchestrator',
    owner: 'Tim Enablement',
    tags: ['demo', 'narasi', 'sales'],
    rating: 4,
    createdAt: now(),
    updatedAt: now(),
    iterations: [
      {
        id: 'prompt-2-it-1',
        createdAt: now(),
        prompt: 'Anda adalah pemandu acara teknologi. Bangun script pembuka untuk demo Higgsfield AI...',
        response: 'Selamat datang di sesi demo Higgsfield AI! Hari ini kita akan menelusuri...',
        evaluation: 'Alur engaging namun perlu diperpendek untuk slot 2 menit.',
        guardrailScore: 88,
        latencyMs: 2500,
        temperature: 0.35,
        topP: 0.85,
        variables: [
          { key: 'audience_persona', value: 'Enterprise CTO' },
          { key: 'demo_focus', value: 'Kemampuan orkestrasi multi-model' }
        ],
      },
      {
        id: 'prompt-2-it-2',
        createdAt: now(),
        prompt: 'Revisi script pembuka agar berdurasi maksimal 90 detik dengan menekankan dampak bisnis.',
        response: 'Halo para visioner teknologi! Dalam 90 detik ke depan saya akan menunjukkan...',
        evaluation: 'Lebih padat, namun CTA akhir masih lemah. Perlu diulang.',
        guardrailScore: 91,
        latencyMs: 2100,
        temperature: 0.3,
        topP: 0.8,
        variables: [
          { key: 'duration', value: '90 detik' },
          { key: 'cta', value: 'Ajak sesi konsultasi pribadi' }
        ],
      },
    ],
  },
  {
    id: 'prompt-3',
    title: 'Evaluasi Guardrail Konten Finansial',
    goal: 'Mengukur kepatuhan konten finansial terhadap guardrail Higgsfield.',
    useCase: 'Audit konten partner',
    status: 'draft',
    model: 'Higgsfield Compliance Shield',
    owner: 'Tim Legal & Compliance',
    tags: ['guardrail', 'finansial', 'evaluasi'],
    createdAt: now(),
    updatedAt: now(),
    iterations: [
      {
        id: 'prompt-3-it-1',
        createdAt: now(),
        prompt: 'Analisis teks berikut dan beri skor kepatuhan terhadap regulasi OJK...',
        response: 'Skor kepatuhan: 72/100. Catatan utama: Klaim imbal hasil belum disertai disclaimer...',
        evaluation: 'Perlu template rekomendasi tindak lanjut otomatis.',
        guardrailScore: 72,
        latencyMs: 3200,
        temperature: 0.1,
        topP: 0.7,
        variables: [
          { key: 'jurisdiction', value: 'OJK' },
          { key: 'risk_level', value: 'Menengah' }
        ],
      },
    ],
  },
];
