# VCCBE - Vocational College Collaboration Backend

Backend API untuk Content Management System program kerja sama sekolah vokasi. Dibangun dengan Next.js 16, Prisma ORM, dan MySQL/MariaDB.

## 🚀 Features

- ✅ **RESTful API** untuk CRUD operations
- ✅ **Countries Management** - Kelola data negara dengan gambar bendera
- ✅ **Programs Management** - Kelola program kerja sama dengan struktur data kompleks
- ✅ **Pagination & Search** - Semua list endpoint mendukung pagination dan pencarian
- ✅ **Filtering** - Filter program berdasarkan negara dan status publish
- ✅ **Validation** - Validasi data yang ketat untuk memastikan integritas data
- ✅ **TypeScript** - Full type safety
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **MariaDB** - Database MySQL-compatible yang dapat dijalankan di Arenhost/cPanel

## 📋 Prerequisites

- Node.js 20+ atau Bun
- MySQL 8+ atau MariaDB 10+
- npm atau bun

## 🛠️ Installation

1. Clone repository ini (jika belum)
```bash
cd d:\Project\magang\vccbe
```

2. Install dependencies
```bash
npm install
# atau
bun install
```

3. Setup environment variables (sudah ada di `.env`)
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

4. Generate Prisma Client
```bash
npx prisma generate
```

5. Push schema ke database (sudah dilakukan)
```bash
npx prisma db push
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
# atau
bun dev
```

Server akan berjalan di `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📚 API Documentation

Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk dokumentasi lengkap semua endpoints.

### Quick Reference

#### Countries
- `GET /api/countries` - Get all countries (with pagination & search)
- `GET /api/countries/:id` - Get country by ID
- `POST /api/countries` - Create new country
- `PUT /api/countries/:id` - Update country
- `DELETE /api/countries/:id` - Delete country

#### Programs
- `GET /api/programs` - Get all programs (with pagination, search & filters)
- `GET /api/programs/:id` - Get program by ID
- `POST /api/programs` - Create new program
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program

## 🗄️ Database Schema

### Country Model
```prisma
model Country {
  id        String    @id @default(cuid())
  name      String    @unique
  flagImage String
  programs  Program[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Program Model
```prisma
model Program {
  id                    String    @id @default(cuid())
  title                 String
  thumbnail             String
  shortDescription      String
  description           String
  countryId             String
  country               Country   @relation(...)
  eligibleStudyPrograms Json      // Array of study programs
  objectives            Json      // Array of {logo, title, description}
  schemes               Json      // Array of {name, description}
  additionalSection     Json?     // {title, shortDescription, type, content}
  gallery               Json      // Array of {imageUrl, title, shortDescription}
  socialMedia           Json      // Flexible object for social links
  isPublished           Boolean   @default(false)
  publishedAt           DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

## 🧪 Testing the API

### Using cURL

**Create a Country:**
```bash
curl -X POST "http://localhost:3000/api/countries" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jepang",
    "flagImage": "/flags/japan.png"
  }'
```

**Get All Countries:**
```bash
curl "http://localhost:3000/api/countries"
```

**Create a Program:**
```bash
curl -X POST "http://localhost:3000/api/programs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Program Magang Jepang 2026",
    "thumbnail": "/thumbnails/japan.jpg",
    "shortDescription": "Program magang ke Jepang",
    "description": "Deskripsi lengkap...",
    "countryId": "YOUR_COUNTRY_ID",
    "eligibleStudyPrograms": ["Teknik Informatika"],
    "objectives": [
      {
        "logo": "/icons/skill.svg",
        "title": "Meningkatkan Skill",
        "description": "Meningkatkan keterampilan teknis"
      }
    ],
    "schemes": [
      {
        "name": "Skema 6 Bulan",
        "description": "Program 6 bulan"
      }
    ],
    "gallery": [
      {
        "imageUrl": "/gallery/1.jpg",
        "title": "Foto 1",
        "shortDescription": "Deskripsi foto"
      }
    ],
    "socialMedia": {
      "instagram": "https://instagram.com/example"
    },
    "isPublished": true
  }'
```

### Using Postman or Thunder Client

Import the endpoints dari dokumentasi API dan test langsung dari VS Code atau Postman.

## 📁 Project Structure

```
vccbe/
├── app/
│   ├── api/
│   │   ├── countries/
│   │   │   ├── route.ts          # GET, POST countries
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE country by ID
│   │   └── programs/
│   │       ├── route.ts          # GET, POST programs
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE program by ID
│   └── ...
├── lib/
│   └── prisma.ts                 # Prisma client instance
├── prisma/
│   └── schema.prisma             # Database schema
├── .env                          # Environment variables
├── prisma.config.ts              # Prisma configuration
├── package.json
├── API_DOCUMENTATION.md          # API documentation
└── README.md                     # This file
```

## 🔧 Database Management

### View Database in Prisma Studio
```bash
npx prisma studio
```

Prisma Studio akan membuka di `http://localhost:5555` dan Anda bisa melihat/edit data langsung.

### Reset Database (DANGER!)
```bash
npx prisma db push --force-reset
```

### Generate Migration (untuk production)
```bash
npx prisma migrate dev --name init
```

## 🌐 Deployment

### Deploy to Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Add environment variable `DATABASE_URL` dengan URL MySQL/MariaDB Arenhost
4. Deploy!

Vercel akan otomatis detect Next.js dan build project.

## 📝 Notes

- **Database Driver**: Menggunakan Prisma MariaDB adapter
- **Character Set**: Migration menggunakan `utf8mb4` dengan collation `utf8mb4_unicode_ci`
- **Type Safety**: Semua API responses fully typed dengan TypeScript
- **Validation**: Semua input divalidasi sebelum masuk database
- **Error Handling**: Comprehensive error handling di semua endpoints

## 🤝 Contributing

Ini adalah project internal, tapi feel free untuk improve dan customize sesuai kebutuhan.

## 📄 License

Private project untuk Sekolah Vokasi.

---

**Happy Coding! 🚀**
