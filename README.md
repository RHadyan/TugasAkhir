# Tugas Akhir — VCC

Aplikasi VCC berbasis Next.js yang menggabungkan website publik, dashboard admin, dan API dalam satu proyek.

Kode aplikasi berada di [`vcc-app/`](vcc-app/). Petunjuk konfigurasi dan pengoperasian tersedia di [README aplikasi](vcc-app/README.md), sedangkan hasil penggabungan dan verifikasi tercatat di [catatan migrasi](vcc-app/docs/MIGRATION.md).

## Menjalankan secara lokal

Gunakan Node.js 24 LTS dan npm.

```sh
cd vcc-app
cp .env.example .env
# Isi konfigurasi database, sesi, Google OAuth, dan ImageKit pada .env.
npm install
npm run dev
```

Pada PowerShell, gunakan `Copy-Item .env.example .env` untuk menyalin contoh konfigurasi.

- Website publik: `http://localhost:3000/id`
- Login admin: `http://localhost:3000/login`
- Dashboard admin: `http://localhost:3000/admin`

Kredensial `.env`, dependensi `node_modules`, cache, dan hasil build tidak disimpan dalam repository. Database tidak ikut diunggah. Tinjau konfigurasi dan petunjuk migrasi sebelum menggunakan database yang sudah berisi data.
