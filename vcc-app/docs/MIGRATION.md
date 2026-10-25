# Penggabungan aplikasi VCC

Tanggal: 25 Oktober 2026.

## Ruang lingkup

Menggabungkan tiga aplikasi asal menjadi satu proyek Next.js, mempertahankan konten dan fitur lama. Belum menambahkan modul pendaftaran, mahasiswa, seleksi, atau fitur tugas akhir baru.

Sumber:

- `C:/Users/Rapka/Documents/botcina/VCC/KomisiKerjaSamaSVIPB`
- `C:/Users/Rapka/Documents/botcina/VCC/adminvcc`
- `C:/Users/Rapka/Documents/botcina/VCC/vccbe`

Tujuan: `C:/Users/Rapka/Documents/ChatGPT/Skripsi/vcc-app`.

Ketiga sumber tidak diubah. Riwayat Git, `node_modules`, `.next`, konfigurasi frontend lama, dan hasil build tidak disalin. Aset admin telah dibandingkan dengan aset publik; semuanya sudah tersedia dan tidak ada benturan isi file.

## Pemetaan route

| Asal | Tujuan |
| --- | --- |
| Website publik `/id`, `/en`, halaman negara/program | URL publik tetap dipertahankan |
| Admin `/` | `/admin` |
| Admin `/countries` | `/admin/countries` |
| Admin `/programs` dan `/programs/[id]` | `/admin/programs` dan `/admin/programs/[id]` |
| Admin `/login` | `/login` |
| Backend `/api/*` | `/api/*` pada origin aplikasi |
| Backend `/auth/google/*` | `/auth/google/*` pada origin aplikasi |

## Perubahan integrasi

- Satu `package.json`, lockfile, konfigurasi TypeScript, dan konfigurasi Next.js.
- Root layout terpisah untuk publik/admin menjaga pemisahan CSS dan tema.
- Config API browser menjadi relatif (`/api`, `/api/admin`); tidak menggunakan backend legacy.
- Proxy tunggal mengatur bahasa, maintenance, akses admin, dan akses API.
- Google OAuth menggunakan origin/callback konfigurasi aplikasi dan state cookie.
- Sesi JWT diverifikasi server, menggunakan cookie HttpOnly. Tidak lagi mengirim JWT melalui URL atau membaca token dengan JavaScript browser.
- Daftar email admin dipindahkan ke `ADMIN_EMAILS`; akun yang dihapus dari daftar langsung kehilangan akses.
- Semua API admin dan operasi perubahan data legacy memerlukan sesi. Mutasi dengan Origin dari situs lain ditolak.
- API publik hanya menampilkan program published, termasuk detail; draft tersedia melalui API admin.
- ImageKit dibuat saat diperlukan; kurangnya konfigurasi upload tidak menjatuhkan semua halaman saat startup.
- Struktur schema dan migrasi database asal tetap dipertahankan. Tidak ada operasi reset, migrasi, atau penulisan database dalam proses penggabungan/verifikasi.

## Konfigurasi yang perlu diperhatikan

Konfigurasi database dan ImageKit lokal tersedia dari backend asal. Backend asal tidak menyediakan Google client ID/secret maupun JWT secret dalam file `.env` yang diperiksa. JWT secret lokal baru dibuat; Google client ID/secret perlu diisi sebelum login sungguhan.

Callback lokal yang perlu didaftarkan pada Google: `http://localhost:3000/auth/google/callback`.

Dokumentasi asal disimpan dalam `docs/legacy/` sebagai referensi dan dapat berisi informasi hosting atau alur lama. README proyek ini menjadi petunjuk konfigurasi yang berlaku.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| Instalasi dependensi | Berhasil; satu `package-lock.json` |
| Unit/regresi | 16 tes lulus: konten, routing bahasa, maintenance, JWT, dan akses API |
| TypeScript | Lulus, tanpa error |
| Validasi Prisma | Schema valid |
| Build produksi Next.js | Berhasil; semua route publik/admin/API terkompilasi |
| Smoke test server produksi | 17 pemeriksaan baca-saja lulus |
| Database | Health check, daftar negara/program publik dan admin menghasilkan HTTP 200 |
| Akses tanpa sesi | Admin diarahkan ke login; API admin dan mutasi legacy menghasilkan 401 |
| Tampilan browser | Beranda Indonesia, daftar program dari database, dan halaman login tampil; tema admin terpisah dari publik |
| Login Google sungguhan | Belum diuji: Google client ID/secret belum tersedia |
| Operasi CRUD/upload nyata | Tidak dijalankan agar data lama tidak berubah |
| ESLint seluruh proyek | Masih 61 error dan 52 warning pada kode yang diwarisi |

Temuan lint terutama `any`, aturan React Hooks, komentar TypeScript lama, tautan HTML, dan penggunaan gambar. Build dan pemeriksaan tipe tetap berhasil. Temuan tersebut tidak ditutupi dengan menonaktifkan aturan lint; perapian kode lama berada di luar tahap penggabungan ini.

Integrasi baca-saja menggunakan sesi uji bertanda tangan yang dibuat di memori oleh script lokal, bukan login Google. Token tidak dicetak atau disimpan. Tidak ada akun atau data baru dibuat. Kredensial/token tidak dimasukkan ke dokumentasi hasil uji.
