# API Testing Examples

Gunakan file ini untuk test API dengan cURL atau copy-paste ke Postman/Thunder Client.

## Base URL
```
http://localhost:3000/api
```

---

## 1. Test Countries API

### Create Country - Jepang
```bash
curl -X POST "http://localhost:3000/api/countries" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jepang\",\"flagImage\":\"/flags/japan.png\"}"
```

### Create Country - Korea Selatan
```bash
curl -X POST "http://localhost:3000/api/countries" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Korea Selatan\",\"flagImage\":\"/flags/korea.png\"}"
```

### Create Country - Singapura
```bash
curl -X POST "http://localhost:3000/api/countries" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Singapura\",\"flagImage\":\"/flags/singapore.png\"}"
```

### Get All Countries
```bash
curl "http://localhost:3000/api/countries"
```

### Get All Countries with Search
```bash
curl "http://localhost:3000/api/countries?search=Jepang"
```

### Get Country by ID (ganti ID_NEGARA dengan ID yang didapat dari create)
```bash
curl "http://localhost:3000/api/countries/ID_NEGARA"
```

### Update Country
```bash
curl -X PUT "http://localhost:3000/api/countries/ID_NEGARA" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jepang (Updated)\",\"flagImage\":\"/flags/japan-new.png\"}"
```

---

## 2. Test Programs API

### Create Program - Program Magang Jepang
**IMPORTANT:** Ganti `COUNTRY_ID_JEPANG` dengan ID negara Jepang yang sudah dibuat!

```bash
curl -X POST "http://localhost:3000/api/programs" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Program Magang Jepang 2026\",
    \"thumbnail\": \"/thumbnails/japan-internship.jpg\",
    \"shortDescription\": \"Program magang ke Jepang untuk mahasiswa vokasi dengan durasi 6-12 bulan\",
    \"description\": \"Program magang ini memberikan kesempatan kepada mahasiswa vokasi untuk mendapatkan pengalaman kerja langsung di perusahaan-perusahaan terkemuka di Jepang. Peserta akan mendapatkan pelatihan intensif, sertifikasi internasional, dan pengalaman budaya yang berharga.\",
    \"countryId\": \"COUNTRY_ID_JEPANG\",
    \"eligibleStudyPrograms\": [
      \"Teknik Informatika\",
      \"Sistem Informasi\",
      \"Manajemen Informatika\",
      \"Teknik Elektro\",
      \"Teknik Mesin\"
    ],
    \"objectives\": [
      {
        \"logo\": \"/icons/skill.svg\",
        \"title\": \"Meningkatkan Keterampilan Teknis\",
        \"description\": \"Peserta akan mendapatkan pelatihan dan pengalaman langsung dalam menggunakan teknologi dan metode kerja terkini yang digunakan di industri Jepang\"
      },
      {
        \"logo\": \"/icons/experience.svg\",
        \"title\": \"Pengalaman Internasional\",
        \"description\": \"Mendapatkan pengalaman bekerja di lingkungan internasional dan memahami budaya kerja Jepang yang terkenal dengan kedisiplinan dan efisiensinya\"
      },
      {
        \"logo\": \"/icons/network.svg\",
        \"title\": \"Membangun Jaringan Profesional\",
        \"description\": \"Kesempatan untuk membangun koneksi dengan profesional dan perusahaan di Jepang yang dapat membuka peluang karir di masa depan\"
      }
    ],
    \"schemes\": [
      {
        \"name\": \"Skema A - Magang 6 Bulan\",
        \"description\": \"Program magang selama 6 bulan di perusahaan teknologi dengan fokus pada pengembangan software dan sistem informasi. Termasuk pelatihan bahasa Jepang dan orientasi budaya.\"
      },
      {
        \"name\": \"Skema B - Magang 12 Bulan dengan Sertifikasi\",
        \"description\": \"Program magang selama 12 bulan dengan tambahan program sertifikasi internasional. Peserta akan mendapatkan mentoring intensif dan kesempatan untuk terlibat dalam proyek-proyek besar.\"
      }
    ],
    \"additionalSection\": {
      \"title\": \"Persyaratan Program\",
      \"shortDescription\": \"Persyaratan yang harus dipenuhi untuk mengikuti program magang ke Jepang\",
      \"type\": \"requirements\",
      \"content\": [
        \"IPK minimal 3.0 dari skala 4.0\",
        \"Mahasiswa aktif semester 6 atau lebih\",
        \"Memiliki kemampuan bahasa Jepang dasar (minimal N5) atau bersedia mengikuti pelatihan\",
        \"Sehat jasmani dan rohani\",
        \"Memiliki paspor yang masih berlaku minimal 1 tahun\",
        \"Mendapat rekomendasi dari program studi\"
      ]
    },
    \"gallery\": [
      {
        \"imageUrl\": \"/gallery/japan-office.jpg\",
        \"title\": \"Kantor Perusahaan Mitra\",
        \"shortDescription\": \"Suasana kantor perusahaan mitra kami di Tokyo yang modern dan nyaman\"
      },
      {
        \"imageUrl\": \"/gallery/japan-training.jpg\",
        \"title\": \"Sesi Pelatihan\",
        \"shortDescription\": \"Peserta magang sedang mengikuti sesi pelatihan teknis\"
      },
      {
        \"imageUrl\": \"/gallery/japan-culture.jpg\",
        \"title\": \"Aktivitas Budaya\",
        \"shortDescription\": \"Peserta mengikuti aktivitas pengenalan budaya Jepang\"
      }
    ],
    \"socialMedia\": {
      \"instagram\": \"https://instagram.com/magang_jepang_sv\",
      \"facebook\": \"https://facebook.com/magangjepangsekolahvokasi\",
      \"website\": \"https://magangjepang.sv.ac.id\",
      \"email\": \"magang.jepang@sv.ac.id\"
    },
    \"isPublished\": true
  }"
```

### Create Program - Pelatihan Korea Selatan
**IMPORTANT:** Ganti `COUNTRY_ID_KOREA` dengan ID negara Korea Selatan!

```bash
curl -X POST "http://localhost:3000/api/programs" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Pelatihan Teknologi Korea 2026\",
    \"thumbnail\": \"/thumbnails/korea-training.jpg\",
    \"shortDescription\": \"Program pelatihan teknologi terkini di Korea Selatan\",
    \"description\": \"Program pelatihan intensif di Korea Selatan yang fokus pada teknologi AI, IoT, dan Smart Manufacturing. Peserta akan belajar langsung dari para ahli di bidangnya.\",
    \"countryId\": \"COUNTRY_ID_KOREA\",
    \"eligibleStudyPrograms\": [
      \"Teknik Informatika\",
      \"Sistem Informasi\",
      \"Teknik Elektro\"
    ],
    \"objectives\": [
      {
        \"logo\": \"/icons/ai.svg\",
        \"title\": \"Menguasai Teknologi AI\",
        \"description\": \"Mempelajari implementasi AI dan Machine Learning dalam industri\"
      },
      {
        \"logo\": \"/icons/iot.svg\",
        \"title\": \"IoT dan Smart Systems\",
        \"description\": \"Memahami konsep dan implementasi Internet of Things\"
      }
    ],
    \"schemes\": [
      {
        \"name\": \"Pelatihan 3 Bulan\",
        \"description\": \"Program pelatihan intensif selama 3 bulan dengan sertifikasi\"
      }
    ],
    \"gallery\": [
      {
        \"imageUrl\": \"/gallery/korea-lab.jpg\",
        \"title\": \"Laboratorium AI\",
        \"shortDescription\": \"Fasilitas laboratorium AI yang canggih\"
      }
    ],
    \"socialMedia\": {
      \"instagram\": \"https://instagram.com/pelatihan_korea_sv\"
    },
    \"isPublished\": true
  }"
```

### Get All Programs
```bash
curl "http://localhost:3000/api/programs"
```

### Get Programs - Filter by Country
```bash
curl "http://localhost:3000/api/programs?countryId=COUNTRY_ID_JEPANG"
```

### Get Programs - Filter Published Only
```bash
curl "http://localhost:3000/api/programs?isPublished=true"
```

### Get Programs - Search
```bash
curl "http://localhost:3000/api/programs?search=magang"
```

### Get Programs - With Pagination
```bash
curl "http://localhost:3000/api/programs?page=1&limit=5"
```

### Get Program by ID
```bash
curl "http://localhost:3000/api/programs/PROGRAM_ID"
```

### Update Program - Unpublish
```bash
curl -X PUT "http://localhost:3000/api/programs/PROGRAM_ID" \
  -H "Content-Type: application/json" \
  -d "{\"isPublished\":false}"
```

### Update Program - Update Title
```bash
curl -X PUT "http://localhost:3000/api/programs/PROGRAM_ID" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Program Magang Jepang 2026 - Updated\"}"
```

### Delete Program
```bash
curl -X DELETE "http://localhost:3000/api/programs/PROGRAM_ID"
```

### Delete Country (akan error jika masih ada program)
```bash
curl -X DELETE "http://localhost:3000/api/countries/COUNTRY_ID"
```

---

## Testing Flow (Recommended Order)

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Create Countries First**
   - Create Jepang
   - Create Korea Selatan
   - Create Singapura
   - Save the IDs from responses

3. **Get All Countries**
   - Verify countries are created
   - Note down the IDs

4. **Create Programs**
   - Replace `COUNTRY_ID_JEPANG` and `COUNTRY_ID_KOREA` with actual IDs
   - Create Program Magang Jepang
   - Create Pelatihan Korea
   - Save the program IDs

5. **Test Filtering & Search**
   - Get all programs
   - Filter by country
   - Filter by published status
   - Search by keyword

6. **Test Update**
   - Update a program title
   - Publish/unpublish a program

7. **Test Get Single Item**
   - Get country by ID
   - Get program by ID

8. **Test Delete**
   - Try to delete country with programs (should fail)
   - Delete a program first
   - Then delete the country (should succeed)

---

## Using Postman/Thunder Client

1. Create a new request
2. Set method (GET, POST, PUT, DELETE)
3. Set URL: `http://localhost:3000/api/countries` or `/programs`
4. For POST/PUT: 
   - Set Headers: `Content-Type: application/json`
   - Set Body: raw JSON
5. Send request

---

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### List Response with Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```
