<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1SFG94FBlxFC7PXPSaZscxxoDr3xDzWjJ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Building a Production Backend

Running the POS app for multiple branches requires a centralized backend so
that users, menus, shifts, and transactions are no longer isolated to the
`localStorage` of each device. Below is a high level plan that uses Supabase,
but you can adapt the same structure to Firebase, Hasura, or a custom Node.js
service.

### 1. Provision Supabase

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard)
   and note the **Project URL** and **anon service key**.
2. In the project settings enable the following features:
   - **Database** (PostgreSQL)
   - **Authentication** (email/password or OTP depending on cashier flow)
   - **Storage** (optional, for product images or receipt uploads)

Store the URL and anon key in environment variables for the frontend, e.g. add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`.

### 2. Design the Data Model

Create SQL tables that mirror the current objects stored in `localStorage`. A
minimal schema might include:

| Table | Purpose |
| ----- | ------- |
| `branches` | Master data for each store location. |
| `users` | Cashiers, supervisors, owners with role & branch assignments. |
| `products` | Menu items, category, price, tax settings, stock flags. |
| `orders` | Sales transactions with totals, discounts, and timestamps. |
| `order_items` | Line items tied to orders and products. |
| `shifts` | Cashier sessions, opening/closing amounts, and status. |
| `payments` | Payment breakdown per order (cash, QRIS, etc.). |

For audit trails add `created_at`, `updated_at`, and `created_by` columns. Use
foreign keys to link related tables and set row level security (RLS) policies
so users can only access their branch data.

### 3. Seed Initial Data

Prepare SQL or CSV seed files for your master data (branches, roles, initial
menu). Run them through the Supabase SQL editor or the `supabase db` CLI to
populate the database.

### 4. Move Business Logic to Supabase

1. Replace any `localStorage` reads/writes in the React hooks/services with
   Supabase queries.
2. Implement CRUD operations via the Supabase JavaScript client. For complex
   flows (e.g., closing a shift and reconciling cash) create stored procedures
   or Supabase Edge Functions to keep logic server-side.
3. Use Supabase Auth for login. For PIN-based flows, you can store hashed PINs
   in the database and verify them with an Edge Function, or migrate to email
   login/OTP for improved security.

### 5. Handle Realtime & Offline

*Realtime:* subscribe to Supabase realtime channels for `orders`, `products`,
and `shifts` to update POS screens instantly when other devices make changes.

*Offline:* keep lightweight caches in `indexedDB` or `localStorage` for active
orders so the app can continue operating briefly without connectivity. Once the
network is restored, sync pending operations to Supabase.

### 6. Testing & Deployment

1. Build integration tests that call the Supabase client to create/read/update
   rows so you can verify RLS rules and role permissions.
2. Deploy the frontend to Vercel (or similar) with the Supabase environment
   variables configured. Restrict domain access in Supabase Auth settings.
3. Monitor database performance and enable automated backups inside Supabase.

Following this roadmap converts the demo POS into a multi-branch SaaS-ready
system with centralized data, authentication, and real-time updates.
