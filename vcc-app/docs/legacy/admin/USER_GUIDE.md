# Panduan Pengguna VCC Admin Dashboard

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Navigasi Dashboard](#navigasi-dashboard)
3. [Manajemen Negara](#manajemen-negara)
4. [Manajemen Program](#manajemen-program)
5. [Tips & Trik](#tips--trik)

---

## Pengenalan

VCC Admin Dashboard adalah sistem manajemen konten untuk mengelola program kerja sama internasional sekolah vokasi. Dashboard ini memungkinkan Anda untuk:

- ✅ Mengelola data negara
- ✅ Mengelola program kerja sama
- ✅ Mempublikasi atau menyimpan program sebagai draft
- ✅ Mencari dan memfilter data dengan mudah

---

## Navigasi Dashboard

### Sidebar Menu

Dashboard memiliki 3 menu utama di sidebar kiri:

1. **Dashboard** 🏠
   - Halaman utama dengan statistik
   - Menampilkan total negara, program, dan status publikasi
   - Quick actions untuk akses cepat

2. **Countries** 🏳️
   - Manajemen data negara
   - CRUD operations untuk negara

3. **Programs** 📚
   - Manajemen data program
   - CRUD operations untuk program
   - Filter berdasarkan negara dan status

---

## Manajemen Negara

### Melihat Daftar Negara

1. Klik menu **"Countries"** di sidebar
2. Anda akan melihat tabel dengan kolom:
   - Name (Nama negara)
   - Flag Image (URL gambar bendera)
   - Programs (Jumlah program)
   - Created (Tanggal dibuat)
   - Actions (Tombol edit & delete)

### Menambah Negara Baru

1. Klik tombol **"Add Country"** (biru dengan icon +)
2. Modal form akan terbuka
3. Isi data yang diperlukan:
   ```
   Country Name: Jepang
   Flag Image URL: /flags/japan.png
   ```
4. Klik **"Create"**
5. Negara baru akan muncul di tabel

### Mengedit Negara

1. Klik icon **pensil biru** pada baris negara yang ingin diedit
2. Modal akan terbuka dengan data yang sudah terisi
3. Edit data yang diperlukan
4. Klik **"Update"**

### Menghapus Negara

1. Klik icon **trash merah** pada baris negara yang ingin dihapus
2. Konfirmasi penghapusan dengan klik "OK"
3. **CATATAN**: Negara tidak bisa dihapus jika masih memiliki program terkait

### Mencari Negara

1. Gunakan search bar di atas tabel
2. Ketik nama negara yang dicari
3. Hasil akan muncul secara real-time

---

## Manajemen Program

### Melihat Daftar Program

1. Klik menu **"Programs"** di sidebar
2. Anda akan melihat tabel dengan kolom:
   - Title (Judul program)
   - Country (Negara terkait)
   - Status (Published/Draft)
   - Created (Tanggal dibuat)
   - Actions (Tombol edit & delete)

### Menambah Program Baru

1. Klik tombol **"Add Program"** (biru dengan icon +)
2. Modal form akan terbuka
3. Isi semua field yang diperlukan:

   **Field Wajib:**
   - **Program Title**: Judul program
     ```
     Contoh: Program Magang Jepang 2026
     ```
   
   - **Thumbnail URL**: URL gambar thumbnail
     ```
     Contoh: /thumbnails/japan-internship.jpg
     ```
   
   - **Short Description**: Deskripsi singkat (2-3 kalimat)
     ```
     Contoh: Program magang ke Jepang untuk mahasiswa vokasi
     ```
   
   - **Full Description**: Deskripsi lengkap program
     ```
     Contoh: Program ini menawarkan kesempatan magang selama 6-12 bulan...
     ```
   
   - **Country**: Pilih negara dari dropdown
     ```
     Pilih salah satu negara yang sudah dibuat
     ```

   **Field Opsional:**
   - **Eligible Study Programs**: Program studi yang eligible
     ```
     Contoh: Teknik Informatika, Sistem Informasi, Manajemen Informatika
     (Pisahkan dengan koma)
     ```
   
   - **Publish this program**: Centang untuk langsung publish

4. Klik **"Create"**

### Mengedit Program

1. Klik icon **pensil biru** pada baris program yang ingin diedit
2. Modal akan terbuka dengan data yang sudah terisi
3. Edit data yang diperlukan
4. Klik **"Update"**

### Menghapus Program

1. Klik icon **trash merah** pada baris program yang ingin dihapus
2. Konfirmasi penghapusan dengan klik "OK"
3. Program akan dihapus dari database

### Mencari Program

1. Gunakan search bar di atas tabel
2. Ketik judul atau deskripsi program
3. Hasil akan muncul secara real-time

### Filter Program

**Filter berdasarkan Negara:**
1. Klik dropdown **"All Countries"**
2. Pilih negara yang diinginkan
3. Tabel akan menampilkan program dari negara tersebut

**Filter berdasarkan Status:**
1. Klik dropdown **"All Status"**
2. Pilih status:
   - **Published**: Program yang sudah dipublikasi
   - **Draft**: Program yang masih draft
3. Tabel akan menampilkan program sesuai status

**Kombinasi Filter:**
- Anda bisa menggunakan search + filter negara + filter status secara bersamaan
- Contoh: Cari "magang" + Negara "Jepang" + Status "Published"

---

## Tips & Trik

### 🎯 Best Practices

1. **Buat Negara Terlebih Dahulu**
   - Sebelum membuat program, pastikan negara sudah dibuat
   - Satu negara bisa memiliki banyak program

2. **Gunakan URL yang Konsisten**
   - Gunakan format URL yang konsisten untuk gambar
   - Contoh: `/flags/japan.png`, `/thumbnails/program-1.jpg`

3. **Deskripsi yang Jelas**
   - Short Description: 2-3 kalimat, ringkas dan menarik
   - Full Description: Detail lengkap tentang program

4. **Draft vs Published**
   - Gunakan Draft untuk program yang masih dalam pengembangan
   - Publish hanya program yang sudah siap ditampilkan

5. **Eligible Study Programs**
   - Pisahkan dengan koma
   - Gunakan nama lengkap program studi
   - Contoh: "Teknik Informatika, Sistem Informasi"

### ⚡ Keyboard Shortcuts

- **Esc**: Tutup modal
- **Enter**: Submit form (saat di dalam modal)

### 🔍 Pagination

- Jika data lebih dari 10 item, akan muncul pagination
- Klik **"Previous"** atau **"Next"** untuk navigasi
- Informasi halaman ditampilkan di bawah tabel

### 💡 Status Indikator

**Countries:**
- Badge biru: Jumlah program per negara

**Programs:**
- Badge hijau dengan dot: Published
- Badge kuning dengan dot: Draft
- Badge ungu: Nama negara

### ⚠️ Error Handling

**Jika terjadi error:**
1. Periksa koneksi internet
2. Pastikan API backend berjalan
3. Cek console browser untuk detail error
4. Refresh halaman jika diperlukan

### 🎨 UI Elements

**Warna Status:**
- 🔵 Biru: Primary actions, info
- 🟢 Hijau: Published, success
- 🟡 Kuning: Draft, warning
- 🔴 Merah: Delete, danger
- 🟣 Ungu: Country tags

**Icons:**
- ✏️ Pensil: Edit
- 🗑️ Trash: Delete
- ➕ Plus: Add new
- 🔍 Search: Search/filter

---

## Troubleshooting

### Program tidak bisa dibuat
- ✅ Pastikan semua field wajib sudah diisi
- ✅ Pastikan negara sudah dipilih
- ✅ Cek format URL gambar

### Negara tidak bisa dihapus
- ✅ Hapus semua program yang terkait dengan negara tersebut terlebih dahulu
- ✅ Atau edit program untuk mengubah negaranya

### Data tidak muncul
- ✅ Refresh halaman
- ✅ Cek filter yang aktif
- ✅ Cek search query
- ✅ Pastikan API backend berjalan

### Modal tidak menutup
- ✅ Klik tombol X di pojok kanan atas
- ✅ Klik area gelap di luar modal
- ✅ Tekan tombol Esc

---

## Kontak & Support

Jika mengalami masalah atau memiliki pertanyaan:
- 📧 Email: admin@vcc.com
- 📚 Dokumentasi API: Lihat `API_DOCUMENTATION.md`
- 🐛 Bug Report: Hubungi developer

---

**Selamat menggunakan VCC Admin Dashboard! 🎉**

Dibuat dengan ❤️ untuk kemudahan manajemen program kerja sama internasional.
