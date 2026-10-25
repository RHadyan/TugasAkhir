# VCC Admin Dashboard

Halaman admin modern untuk mengelola negara dan program kerja sama internasional sekolah vokasi.

## 🎨 Fitur Utama

### Dashboard
- **Statistik Real-time**: Menampilkan total negara, total program, program yang dipublikasi, dan draft program
- **Quick Actions**: Akses cepat ke fungsi-fungsi utama
- **Informasi Panduan**: Panduan memulai dan link ke dokumentasi API

### Countries Management (Manajemen Negara)
- ✅ **Create**: Tambah negara baru dengan nama dan gambar bendera
- ✅ **Read**: Lihat daftar semua negara dengan pagination
- ✅ **Update**: Edit informasi negara yang sudah ada
- ✅ **Delete**: Hapus negara (tidak bisa dihapus jika masih ada program terkait)
- 🔍 **Search**: Cari negara berdasarkan nama
- 📊 **Info**: Lihat jumlah program per negara

### Programs Management (Manajemen Program)
- ✅ **Create**: Tambah program baru dengan informasi lengkap
- ✅ **Read**: Lihat daftar semua program dengan pagination
- ✅ **Update**: Edit informasi program yang sudah ada
- ✅ **Delete**: Hapus program
- 🔍 **Search**: Cari program berdasarkan judul atau deskripsi
- 🎯 **Filter**: Filter berdasarkan negara dan status publikasi
- 📝 **Status**: Tandai program sebagai Published atau Draft

## 🚀 Cara Menjalankan

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```

3. **Buka browser**:
   ```
   http://localhost:3000
   ```

## 📁 Struktur Folder

```
adminvcc/
├── app/
│   ├── components/          # Komponen reusable
│   │   ├── Sidebar.tsx     # Navigasi sidebar
│   │   ├── Button.tsx      # Komponen tombol
│   │   ├── Modal.tsx       # Komponen modal
│   │   └── Input.tsx       # Komponen input form
│   ├── countries/          # Halaman manajemen negara
│   │   └── page.tsx
│   ├── programs/           # Halaman manajemen program
│   │   └── page.tsx
│   ├── layout.tsx          # Layout utama
│   ├── page.tsx            # Dashboard homepage
│   └── globals.css         # Global styles
├── public/                 # File statis
├── API_DOCUMENTATION.md    # Dokumentasi API
└── package.json
```

## 🎨 Desain & UI

### Tema
- **Dark Mode**: Interface modern dengan tema gelap
- **Gradient Colors**: Penggunaan gradient untuk visual yang menarik
- **Smooth Animations**: Animasi halus untuk UX yang lebih baik
- **Responsive**: Desain yang responsif untuk berbagai ukuran layar

### Komponen
- **Sidebar Navigation**: Navigasi tetap di sisi kiri
- **Modal Forms**: Form create/edit dalam modal
- **Data Tables**: Tabel data dengan hover effects
- **Status Badges**: Badge berwarna untuk status
- **Loading States**: Spinner untuk loading state

## 🔌 API Integration

Dashboard ini terintegrasi dengan API backend di:
```
https://vccbe.vercel.app/api
```

### Endpoints yang Digunakan

#### Countries
- `GET /api/countries` - Ambil daftar negara
- `GET /api/countries/:id` - Ambil detail negara
- `POST /api/countries` - Buat negara baru
- `PUT /api/countries/:id` - Update negara
- `DELETE /api/countries/:id` - Hapus negara

#### Programs
- `GET /api/programs` - Ambil daftar program
- `GET /api/programs/:id` - Ambil detail program
- `POST /api/programs` - Buat program baru
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Hapus program

Lihat `API_DOCUMENTATION.md` untuk detail lengkap.

## 📝 Cara Menggunakan

### Menambah Negara Baru

1. Klik menu **"Countries"** di sidebar
2. Klik tombol **"Add Country"**
3. Isi form:
   - **Country Name**: Nama negara (contoh: "Jepang")
   - **Flag Image URL**: URL gambar bendera (contoh: "/flags/japan.png")
4. Klik **"Create"**

### Menambah Program Baru

1. Klik menu **"Programs"** di sidebar
2. Klik tombol **"Add Program"**
3. Isi form:
   - **Program Title**: Judul program
   - **Thumbnail URL**: URL gambar thumbnail
   - **Short Description**: Deskripsi singkat
   - **Full Description**: Deskripsi lengkap
   - **Country**: Pilih negara dari dropdown
   - **Eligible Study Programs**: Program studi yang eligible (pisahkan dengan koma)
   - **Publish**: Centang untuk mempublikasi langsung
4. Klik **"Create"**

### Mengedit Data

1. Klik icon **pensil** (✏️) pada baris data yang ingin diedit
2. Modal akan terbuka dengan data yang sudah terisi
3. Edit data yang diperlukan
4. Klik **"Update"**

### Menghapus Data

1. Klik icon **trash** (🗑️) pada baris data yang ingin dihapus
2. Konfirmasi penghapusan
3. Data akan dihapus jika memenuhi syarat

### Mencari & Filter

**Countries:**
- Gunakan search bar untuk mencari berdasarkan nama negara

**Programs:**
- Gunakan search bar untuk mencari berdasarkan judul/deskripsi
- Filter berdasarkan negara menggunakan dropdown "All Countries"
- Filter berdasarkan status menggunakan dropdown "All Status"

## 🛠️ Teknologi yang Digunakan

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **Fetch API** - HTTP requests

## 🎯 Fitur Tambahan

- **Pagination**: Navigasi halaman untuk data yang banyak
- **Real-time Search**: Pencarian langsung saat mengetik
- **Error Handling**: Penanganan error dengan alert
- **Confirmation Dialogs**: Konfirmasi sebelum menghapus
- **Loading States**: Indikator loading saat fetch data
- **Responsive Design**: Tampilan optimal di semua device

## 📱 Screenshot

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Countries Management
![Countries](https://via.placeholder.com/800x400?text=Countries+Management)

### Programs Management
![Programs](https://via.placeholder.com/800x400?text=Programs+Management)

## 🔐 Catatan Keamanan

⚠️ **PENTING**: Dashboard ini belum memiliki autentikasi. Untuk production:
1. Tambahkan sistem login/authentication
2. Implementasi authorization untuk CRUD operations
3. Validasi input di client dan server side
4. Gunakan HTTPS untuk komunikasi API
5. Implementasi rate limiting

## 📄 License

MIT License - Silakan gunakan untuk keperluan apapun.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk VCC (Vocational College Collaboration)

---

**Selamat menggunakan VCC Admin Dashboard! 🚀**
