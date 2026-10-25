# VCC App

Satu aplikasi Next.js untuk website publik, dashboard admin, dan API VCC.
Sumber awal tetap disimpan di tiga proyek lama; proyek ini tidak bergantung pada server frontend/backend lama.

## Menjalankan

Gunakan Node.js 24 LTS dan npm. Dari direktori proyek:

```powershell
npm install
# Untuk checkout baru, salin .env.example menjadi .env dan isi nilainya.
npm run db:generate
npm run dev
```

- Publik Indonesia: http://localhost:3000/id
- Publik Inggris: http://localhost:3000/en
- Login admin: http://localhost:3000/login
- Dashboard: http://localhost:3000/admin
- API publik: `/api/countries` dan `/api/programs`
- API admin: `/api/admin/countries` dan `/api/admin/programs`
- Pemeriksaan database: `/api/health-check`

## Konfigurasi

`.env` adalah konfigurasi privat, diabaikan Git. Pada salinan lokal pertama, konfigurasi server dari backend sumber disalin tanpa mencetak nilainya. Tidak ada migrasi, reset, atau perubahan data otomatis saat instalasi/build.

| Variabel | Fungsi |
| --- | --- |
| `DATABASE_URL` | Koneksi MySQL/MariaDB yang sudah digunakan backend |
| `APP_URL` | Origin aplikasi, lokal `http://localhost:3000`; ganti saat deployment |
| `NEXT_PUBLIC_SITE_URL` | URL untuk metadata/canonical publik |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Kredensial OAuth Google |
| `GOOGLE_REDIRECT_URI` | Callback, lokal `http://localhost:3000/auth/google/callback` |
| `JWT_SECRET` | Rahasia penandatanganan sesi server |
| `ADMIN_EMAILS` | Email admin dipisahkan koma |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` | Upload dan URL gambar |
| `SITE_STATUS` | `active` atau `maintenance`; admin tetap dapat diakses |

Tambahkan callback lokal di Authorized redirect URIs pada OAuth client Google yang sesuai. Mengubah `.env` saja tidak mendaftarkan callback pada Google. Untuk deployment, gunakan HTTPS, set origin/callback produksi, dan daftarkan callback tersebut juga.

Schema dan migrasi database dipertahankan dari backend. `npm run db:migrate` hanya dijalankan setelah meninjau database tujuan dan migrasinya; jangan menjalankan reset atau `db push` terhadap database lama untuk sekadar mencoba aplikasi.

## Struktur

```text
app/(public)/          Website publik beserta routing bahasa dan layout asal
app/(console)/admin/  Dashboard, negara, dan program di bawah /admin
app/(console)/login/  Login dengan tampilan admin
app/auth/             Google OAuth
app/api/              API publik, admin, sesi, dan logout
components/           Komponen UI admin
lib/                  Prisma, terjemahan, sesi, dan konfigurasi API
configs/              ImageKit
prisma/               Schema dan migrasi asal
public/               Aset website
tests/                Pengujian terjemahan, routing, sesi, dan batas akses
docs/legacy/          Dokumentasi proyek asal (dapat menyebut deployment lama)
```

Route group `(public)` dan `(console)` tidak muncul pada URL. Masing-masing memiliki root layout agar CSS dan tema admin tidak diterapkan pada website publik. Perpindahan antar-root layout menggunakan navigasi dokumen baru oleh Next.js.

## Validasi

```powershell
npm test
npm run typecheck
npm run db:validate
npm run build
npm start
# Opsional, ketika server sedang berjalan: pemeriksaan integrasi baca-saja
node scripts/smoke-test.mjs --database
```

`build` menghasilkan Prisma Client, tidak memigrasikan database. Build admin mengambil font Manrope melalui `next/font/google`, sehingga instalasi/build pertama memerlukan koneksi jaringan. Database, Google OAuth, dan ImageKit memerlukan layanan/kredensial yang aktif untuk pengujian integrasi penuh.

Catatan perubahan dan hasil verifikasi ada di `docs/MIGRATION.md`.
