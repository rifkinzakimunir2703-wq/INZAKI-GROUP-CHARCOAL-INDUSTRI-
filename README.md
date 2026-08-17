# Portal Manajemen Arang

Portal mobile-first untuk pencatatan produksi, stok, transaksi, kas dan laporan bisnis industri arang.

## Teknologi
- Next.js + TypeScript
- Tailwind CSS
- Supabase
- lucide-react

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Supabase

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql`.
4. Salin Project URL dan anon key ke `.env.local`.

## Catatan
Dashboard awal menggunakan data contoh. Dashboard memiliki bagan penyusutan/rendemen interaktif, form batch produksi, perhitungan HPP/kg, riwayat batch, dan ringkasan rendemen.

## Struktur
- `app/` UI Next.js
- `lib/supabase.ts` client Supabase
- `supabase/schema.sql` database MVP
