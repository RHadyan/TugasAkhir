# Ringkasan Perubahan Upload Gambar

## Apa yang Sudah Diubah?

Semua endpoint API yang menangani upload gambar di project **vccbe** telah diubah untuk mengikuti pola yang sama dengan project **besukma**, yaitu menggunakan **FormData** dan **ImageKit**.

## File yang Dimodifikasi

### 1. **Countries API**

#### File: `app/api/countries/route.ts`
- ✅ POST endpoint: Sekarang menerima file gambar bendera melalui FormData
- ✅ Import imageKit ditambahkan

#### File: `app/api/countries/[id]/route.ts`
- ✅ PUT endpoint: Sekarang bisa update gambar bendera melalui FormData (opsional)
- ✅ Import imageKit ditambahkan

### 2. **Programs API**

#### File: `app/api/programs/route.ts`
- ✅ POST endpoint: Sekarang menerima multiple file gambar:
  - `thumbnail` (wajib)
  - `objectiveLogos` (opsional, untuk array objectives)
  - `galleryImages` (opsional, untuk array gallery)
- ✅ Import imageKit ditambahkan

#### File: `app/api/programs/[id]/route.ts`
- ✅ PUT endpoint: Sekarang bisa update gambar melalui FormData (opsional)
- ✅ Import imageKit ditambahkan

## Cara Kerja Upload Gambar

### Sebelumnya (JSON):
```javascript
// ❌ Cara lama
const response = await fetch('/api/countries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Japan',
    flagImage: 'https://example.com/flag.png' // URL string
  })
});
```

### Sekarang (FormData):
```javascript
// ✅ Cara baru
const formData = new FormData();
formData.append('name', 'Japan');
formData.append('flagImage', fileObject); // File object dari input

const response = await fetch('/api/countries', {
  method: 'POST',
  body: formData // Tidak perlu set Content-Type header
});
```

## Fitur ImageKit

Semua gambar yang diupload akan:

1. **Disimpan di ImageKit** dengan struktur folder yang rapi:
   - Bendera negara: `countries/flags/`
   - Thumbnail program: `programs/thumbnails/`
   - Logo objectives: `programs/objectives/`
   - Gambar gallery: `programs/gallery/`

2. **Dioptimasi otomatis**:
   - Kualitas: auto (otomatis disesuaikan)
   - Format: webp (format modern, lebih kecil)
   - Tinggi maksimal: 1024px

## Contoh Penggunaan

### Upload Country dengan Gambar Bendera

```javascript
const formData = new FormData();
formData.append('name', 'Jepang');
formData.append('flagImage', flagFile); // dari <input type="file">

const response = await fetch('/api/countries', {
  method: 'POST',
  body: formData
});
```

### Upload Program dengan Multiple Gambar

```javascript
const formData = new FormData();

// Data dasar
formData.append('title', 'Program Magang Jepang');
formData.append('shortDescription', 'Deskripsi singkat');
formData.append('description', 'Deskripsi lengkap');
formData.append('countryId', 'id-negara');
formData.append('isPublished', 'true');

// Thumbnail (wajib)
formData.append('thumbnail', thumbnailFile);

// Objectives dengan logo
const objectives = [
  { title: 'Tujuan 1', description: 'Deskripsi 1', logo: '' },
  { title: 'Tujuan 2', description: 'Deskripsi 2', logo: '' }
];
formData.append('objectives', JSON.stringify(objectives));

// Upload logo untuk objectives (urutan harus sama dengan array objectives)
formData.append('objectiveLogos', logoFile1);
formData.append('objectiveLogos', logoFile2);

// Gallery dengan gambar
const gallery = [
  { title: 'Foto 1', shortDescription: 'Deskripsi 1', imageUrl: '' },
  { title: 'Foto 2', shortDescription: 'Deskripsi 2', imageUrl: '' }
];
formData.append('gallery', JSON.stringify(gallery));

// Upload gambar untuk gallery (urutan harus sama dengan array gallery)
formData.append('galleryImages', galleryImage1);
formData.append('galleryImages', galleryImage2);

const response = await fetch('/api/programs', {
  method: 'POST',
  body: formData
});
```

## Yang Perlu Diperhatikan

### ⚠️ Penting untuk Frontend Developer:

1. **Jangan set Content-Type header** saat kirim FormData. Browser akan set otomatis.

2. **Field JSON harus di-stringify**:
   ```javascript
   // ✅ Benar
   formData.append('objectives', JSON.stringify(objectives));
   
   // ❌ Salah
   formData.append('objectives', objectives);
   ```

3. **Urutan file harus sama** dengan urutan item di array:
   ```javascript
   // Objectives array: [obj1, obj2, obj3]
   // Logo files harus diupload dengan urutan yang sama:
   formData.append('objectiveLogos', logoFile1); // untuk obj1
   formData.append('objectiveLogos', logoFile2); // untuk obj2
   formData.append('objectiveLogos', logoFile3); // untuk obj3
   ```

4. **Update (PUT) - gambar opsional**:
   - Hanya append file gambar jika ingin mengupdate
   - Jika tidak append, URL gambar lama akan tetap dipakai

## Environment Variables

Pastikan sudah ada di file `.env`:

```env
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

## Langkah Selanjutnya

Yang perlu Anda lakukan:

1. ✅ **Backend sudah selesai** - Semua API route sudah diupdate
2. ⏳ **Update Frontend** - Ubah form untuk menggunakan FormData
3. ⏳ **Testing** - Test semua endpoint upload
4. ⏳ **Update dokumentasi API** - Jika ada API docs

## Troubleshooting

### Error: "Cannot find name 'imageKit'"
**Solusi**: Sudah diperbaiki, semua import imageKit sudah ditambahkan.

### Error: "Invalid [field] format"
**Solusi**: Pastikan field JSON di-stringify sebelum append ke FormData.

### Gambar tidak terupload
**Solusi**: 
1. Cek environment variables sudah benar
2. Cek kredensial ImageKit valid
3. Cek ukuran file (default Next.js max 4.5MB)

## Dokumentasi Lengkap

Lihat file `IMAGE_UPLOAD_MIGRATION.md` untuk dokumentasi lengkap dalam bahasa Inggris dengan lebih banyak contoh dan detail teknis.

## Kesimpulan

✅ Semua endpoint upload gambar sudah diupdate
✅ Mengikuti pola yang sama dengan project besukma
✅ Menggunakan ImageKit untuk storage dan optimasi
✅ Siap untuk digunakan setelah frontend diupdate
