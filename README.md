<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repository berisi aplikasi **Higgsfield Prompt Atlas**, sebuah pusat kendali untuk mendokumentasikan eksperimen prompt, parameter inferensi, dan hasil evaluasi dari model-model Higgsfield AI. Gunakan aplikasi ini untuk:

- Menyimpan prompt baru lengkap dengan goal, squad owner, dan dataset referensi.
- Melacak iterasi eksperimen, skor guardrail, dan latency inference.
- Memfilter katalog prompt berdasarkan status, tag, atau model Higgsfield yang digunakan.
- Mengevaluasi kesehatan portofolio prompt melalui panel statistik real-time.

Panduan berikut membantu Anda menjalankan aplikasi secara lokal.

View your app in AI Studio: https://ai.studio/apps/drive/1SFG94FBlxFC7PXPSaZscxxoDr3xDzWjJ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
