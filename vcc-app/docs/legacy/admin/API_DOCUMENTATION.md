# API Documentation - VCC Backend

API untuk Content Management System program kerja sama sekolah vokasi.

## Base URL
```
http://vccbe.vercel.app/api
```

---

## Countries API

### 1. Get All Countries
**Endpoint:** `GET /api/countries`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by country name

**Example Request:**
```bash
curl "http://vccbe.vercel.app/api/countries?page=1&limit=10&search=Indonesia"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "name": "Indonesia",
      "flagImage": "/flags/indonesia.png",
      "createdAt": "2026-01-22T06:00:00.000Z",
      "updatedAt": "2026-01-22T06:00:00.000Z",
      "_count": {
        "programs": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 2. Get Country by ID
**Endpoint:** `GET /api/countries/:id`

**Example Request:**
```bash
curl "http://vccbe.vercel.app/api/countries/clx1234567890"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "Indonesia",
    "flagImage": "/flags/indonesia.png",
    "createdAt": "2026-01-22T06:00:00.000Z",
    "updatedAt": "2026-01-22T06:00:00.000Z",
    "programs": [
      {
        "id": "clx9876543210",
        "title": "Program Magang Jepang",
        "thumbnail": "/thumbnails/japan.jpg",
        "shortDescription": "Program magang ke Jepang",
        "isPublished": true
      }
    ]
  }
}
```

---

### 3. Create Country
**Endpoint:** `POST /api/countries`

**Request Body:**
```json
{
  "name": "Jepang",
  "flagImage": "/flags/japan.png"
}
```

**Example Request:**
```bash
curl -X POST "http://vccbe.vercel.app/api/countries" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jepang",
    "flagImage": "/flags/japan.png"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "name": "Jepang",
    "flagImage": "/flags/japan.png",
    "createdAt": "2026-01-22T06:00:00.000Z",
    "updatedAt": "2026-01-22T06:00:00.000Z"
  },
  "message": "Country created successfully"
}
```

---

### 4. Update Country
**Endpoint:** `PUT /api/countries/:id`

**Request Body:**
```json
{
  "name": "Jepang (Updated)",
  "flagImage": "/flags/japan-new.png"
}
```

**Example Request:**
```bash
curl -X PUT "http://vccbe.vercel.app/api/countries/clx1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jepang (Updated)",
    "flagImage": "/flags/japan-new.png"
  }'
```

---

### 5. Delete Country
**Endpoint:** `DELETE /api/countries/:id`

**Example Request:**
```bash
curl -X DELETE "http://vccbe.vercel.app/api/countries/clx1234567890"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Country deleted successfully"
}
```

**Note:** Cannot delete country if it has associated programs.

---

## Programs API

### 1. Get All Programs
**Endpoint:** `GET /api/programs`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title or description
- `countryId` (optional): Filter by country ID
- `isPublished` (optional): Filter by publish status (true/false)

**Example Request:**
```bash
curl "http://vccbe.vercel.app/api/programs?page=1&limit=10&countryId=clx1234567890&isPublished=true"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx9876543210",
      "title": "Program Magang Jepang 2026",
      "thumbnail": "/thumbnails/japan-internship.jpg",
      "shortDescription": "Program magang ke Jepang untuk mahasiswa vokasi",
      "description": "Deskripsi lengkap program...",
      "countryId": "clx1234567890",
      "eligibleStudyPrograms": ["Teknik Informatika", "Sistem Informasi"],
      "objectives": [...],
      "schemes": [...],
      "additionalSection": {...},
      "gallery": [...],
      "socialMedia": {...},
      "isPublished": true,
      "publishedAt": "2026-01-22T06:00:00.000Z",
      "createdAt": "2026-01-22T06:00:00.000Z",
      "updatedAt": "2026-01-22T06:00:00.000Z",
      "country": {
        "id": "clx1234567890",
        "name": "Jepang",
        "flagImage": "/flags/japan.png"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 2. Get Program by ID
**Endpoint:** `GET /api/programs/:id`

**Example Request:**
```bash
curl "http://vccbe.vercel.app/api/programs/clx9876543210"
```

---

### 3. Create Program
**Endpoint:** `POST /api/programs`

**Request Body:**
```json
{
  "title": "Program Magang Jepang 2026",
  "thumbnail": "/thumbnails/japan-internship.jpg",
  "shortDescription": "Program magang ke Jepang untuk mahasiswa vokasi",
  "description": "Deskripsi lengkap program magang ke Jepang...",
  "countryId": "clx1234567890",
  "eligibleStudyPrograms": [
    "Teknik Informatika",
    "Sistem Informasi",
    "Manajemen Informatika"
  ],
  "objectives": [
    {
      "logo": "/icons/skill.svg",
      "title": "Meningkatkan Keterampilan",
      "description": "Meningkatkan keterampilan teknis dan soft skills"
    },
    {
      "logo": "/icons/experience.svg",
      "title": "Pengalaman Internasional",
      "description": "Mendapatkan pengalaman kerja di perusahaan Jepang"
    }
  ],
  "schemes": [
    {
      "name": "Skema A - 6 Bulan",
      "description": "Program magang selama 6 bulan di perusahaan teknologi"
    },
    {
      "name": "Skema B - 12 Bulan",
      "description": "Program magang selama 12 bulan dengan sertifikasi"
    }
  ],
  "additionalSection": {
    "title": "Persyaratan",
    "shortDescription": "Persyaratan untuk mengikuti program",
    "type": "requirements",
    "content": [
      "IPK minimal 3.0",
      "Mahasiswa aktif semester 6 atau lebih",
      "Memiliki kemampuan bahasa Jepang dasar"
    ]
  },
  "gallery": [
    {
      "imageUrl": "/gallery/japan-1.jpg",
      "title": "Kantor Perusahaan",
      "shortDescription": "Suasana kantor perusahaan mitra di Tokyo"
    },
    {
      "imageUrl": "/gallery/japan-2.jpg",
      "title": "Peserta Magang",
      "shortDescription": "Peserta magang sedang bekerja"
    }
  ],
  "socialMedia": {
    "instagram": "https://instagram.com/program_magang_jepang",
    "facebook": "https://facebook.com/programmagangjepang",
    "website": "https://magangjepang.com"
  },
  "isPublished": true
}
```

**Example Request:**
```bash
curl -X POST "http://vccbe.vercel.app/api/programs" \
  -H "Content-Type: application/json" \
  -d @program-data.json
```

---

### 4. Update Program
**Endpoint:** `PUT /api/programs/:id`

**Request Body:** (Same structure as Create, all fields optional)

**Example Request:**
```bash
curl -X PUT "http://vccbe.vercel.app/api/programs/clx9876543210" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Program Magang Jepang 2026 (Updated)",
    "isPublished": false
  }'
```

---

### 5. Delete Program
**Endpoint:** `DELETE /api/programs/:id`

**Example Request:**
```bash
curl -X DELETE "http://vccbe.vercel.app/api/programs/clx9876543210"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Program deleted successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Conflict error message (e.g., duplicate name)"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to process request"
}
```

---

## Data Structure Details

### Objectives Array
Each objective object must have:
- `logo` (string): URL/path to icon/logo
- `title` (string): Objective title
- `description` (string): Objective description

### Schemes Array
Each scheme object must have:
- `name` (string): Scheme name
- `description` (string): Scheme description

### Additional Section Object
- `title` (string): Section title
- `shortDescription` (string): Brief description
- `type` (string): Section type (e.g., "requirements", "benefits")
- `content` (array): Array of content items

### Gallery Array
Each gallery item must have:
- `imageUrl` (string): URL/path to image
- `title` (string): Image title
- `shortDescription` (string): Image description

### Social Media Object
Flexible object, can contain any social media links:
```json
{
  "instagram": "https://...",
  "facebook": "https://...",
  "twitter": "https://...",
  "linkedin": "https://...",
  "website": "https://..."
}
```
