"use client";

import Link from "next/link";
import { Header, Footer } from "@/app/(public)/components";
import Image from "next/image";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function ChuoPage() {
  const { language, localizedPath } = useLanguage();
  const isId = language === "id";
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                International Program: 3+2 Scheme with Chuo Joho Institute
              </h1>
              <p className="text-lg text-gray-600">
                {isId
                  ? "Program kolaboratif setara Diploma 4 (D4) yang mempersiapkan mahasiswa untuk bersaing di pasar kerja global, khususnya Jepang."
                  : "A collaborative program equivalent to a four-year applied degree, preparing students to compete in the global job market, particularly in Japan."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#program-details"
                  className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg text-center"
                >
                  {isId ? "Pelajari Program" : "Explore the Program"}
                </a>
                <a
                  href="#gallery"
                  className="px-8 py-4 bg-white text-orange-700 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-all text-center"
                >
                  {isId ? "Lihat Galeri" : "View Gallery"}
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/chuo/hero-placeholder.webp"
                alt="Chuo Joho Institute Program"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Program Overview Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
                {isId ? "Gambaran Program" : "Program Overview"}
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  {isId
                    ? "Sekolah Vokasi IPB University bekerja sama dengan Chuo Joho Institute, Jepang, membuka Program Internasional skema 3+2 yang dirancang untuk mempersiapkan mahasiswa agar mampu bersaing di pasar kerja global, khususnya Jepang. Program ini mengintegrasikan pendidikan akademik, pelatihan keterampilan kerja, serta pemahaman budaya dan etos kerja Jepang."
                    : "IPB Vocational School and Chuo Joho Institute in Japan offer a 3+2 international program designed to prepare students for the global job market. It combines academic education, workplace skills, and an understanding of Japanese culture and work ethics."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Program Objectives */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
                {isId ? "Tujuan Program" : "Program Objectives"}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <span className="text-3xl text-white">🎓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isId ? "Melanjutkan Studi" : "Continue Studying"}
                  </h3>
                  <p className="text-gray-700">
                    {isId ? "Mempersiapkan mahasiswa untuk melanjutkan studi di Jepang" : "Prepare students to continue their studies in Japan"}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <span className="text-3xl text-white">💼</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isId ? "Bekerja di Jepang" : "Work in Japan"}
                  </h3>
                  <p className="text-gray-700">
                    {isId ? "Mempersiapkan mahasiswa untuk bekerja di Jepang" : "Prepare students for employment in Japan"}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <span className="text-3xl text-white">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {isId ? "Kompetensi Global" : "Global Competence"}
                  </h3>
                  <p className="text-gray-700">
                    {isId ? "Membekali mahasiswa dengan kompetensi dan keterampilan yang sesuai dengan kebutuhan pasar kerja Jepang" : "Equip students with competencies and skills aligned with the needs of the Japanese job market"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3+2 Program Scheme */}
        <section id="program-details" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
                {isId ? "Skema Program 3+2" : "3+2 Program Scheme"}
              </h2>
              <p className="text-lg text-gray-700 mb-8 text-center">
                {isId ? "Program ini merupakan jalur pendidikan kolaboratif setara Diploma 4 (D4) dengan alur sebagai berikut:" : "This collaborative education pathway is equivalent to a four-year applied degree and follows these stages:"}
              </p>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {isId ? "6 Semester (3 Tahun) di Sekolah Vokasi IPB University" : "6 Semesters (3 Years) at IPB Vocational School"}
                      </h4>
                      <p className="text-gray-700">
                        {isId ? "Studi di Sekolah Vokasi IPB University dengan kurikulum yang dirancang khusus untuk mempersiapkan mahasiswa mengikuti program lanjutan di Jepang." : "Study at IPB Vocational School with a curriculum designed to prepare students for the continuation program in Japan."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {isId ? "1 Semester (6 Bulan) Pembelajaran Bahasa Jepang di Jepang" : "1 Semester (6 Months) of Japanese Language Study in Japan"}
                      </h4>
                      <p className="text-gray-700">
                        {isId ? "Program intensif pembelajaran bahasa Jepang langsung di Jepang untuk mempersiapkan komunikasi dan adaptasi budaya." : "Intensive Japanese language study in Japan to build communication skills and cultural adaptability."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {isId ? "Wisuda di IPB University" : "Graduation from IPB University"}
                      </h4>
                      <p className="text-gray-700">
                        {isId ? "Setelah menyelesaikan 6 semester di IPB, mahasiswa akan diwisuda dan mendapatkan gelar dari IPB University." : "After completing six semesters at IPB, students graduate and receive their degree from IPB University."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {isId ? "4 Semester (2 Tahun) Studi Lanjutan di Chuo Joho Institute, Jepang" : "4 Semesters (2 Years) of Further Study at Chuo Joho Institute, Japan"}
                      </h4>
                      <p className="text-gray-700">
                        {isId ? "Melanjutkan studi di Chuo Joho Institute dengan fokus pada Program Desain Bisnis." : "Continue studying at Chuo Joho Institute with a focus on the Business Design Program."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarship Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
                {isId ? "Beasiswa dan Dukungan Keuangan" : "Scholarship and Financial Support"}
              </h2>
              <p className="text-lg text-gray-700 mb-8 text-center">
                {isId ? "Mahasiswa berkesempatan memperoleh dukungan pendanaan melalui skema sponsor atau beasiswa berikut:" : "Students may receive financial support through the following sponsorship and scholarship schemes:"}
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-orange-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <span className="text-3xl text-white">📰</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Nikkei Newspaper Scholarship
                  </h3>
                  <p className="text-gray-700">
                    {isId ? "Beasiswa dari Nikkei Newspaper untuk mendukung studi dan kehidupan mahasiswa di Jepang." : "A Nikkei Newspaper scholarship supporting students' studies and living costs in Japan."}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-orange-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                    <span className="text-3xl text-white">📄</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Yomiuri Shimbun Scholarship
                  </h3>
                  <p className="text-gray-700">
                    {isId ? "Beasiswa dari Yomiuri Shimbun untuk mendukung pendidikan mahasiswa selama di Jepang." : "A Yomiuri Shimbun scholarship supporting students throughout their education in Japan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Implementation */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
                {isId ? "Implementasi Program" : "Program Implementation"}
              </h2>
              <p className="text-lg text-gray-700 mb-12 text-center">
                {isId ? "Program 3+2 telah diimplementasikan melalui keberangkatan mahasiswa ke Jepang dalam beberapa batch:" : "The 3+2 program is underway, with students departing for Japan in the following batches:"}
              </p>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg border-2 border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">✓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        Batch 1
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong>Participant:</strong> Angga
                        </p>
                        <p className="text-green-700 font-semibold">
                          <strong>Status:</strong> Successfully Departed to Japan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl shadow-lg border-2 border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">✓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">
                        Batch 2
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong>Participants:</strong> Ernesto, Hauzan
                        </p>
                        <p className="text-green-700 font-semibold">
                          <strong>Status:</strong> Successfully Departed to Japan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
                {isId ? "Galeri" : "Gallery"}
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Gallery Item 1 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-64">
                    <img
                      src="/images/chuo/student-activities.webp"
                      alt="Chuo Joho Institute – Student Activities"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Chuo Joho Institute – Student Activities
                    </h3>
                    <p className="text-gray-700">
                      {isId ? "Dokumentasi mahasiswa Sekolah Vokasi IPB University selama mengikuti program di Chuo Joho Institute, Jepang." : "IPB Vocational School students participating in the program at Chuo Joho Institute, Japan."}
                    </p>
                  </div>
                </div>

                {/* Gallery Item 2 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-64">
                    <img
                      src="/images/chuo/batch1-departure.webp"
                      alt="Departure of Batch 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Departure of Batch 1
                    </h3>
                    <p className="text-gray-700">
                      {isId ? "Keberangkatan Angga sebagai peserta Batch 1 Program Internasional 3+2 ke Jepang." : "Angga's departure for Japan as a participant in Batch 1 of the 3+2 International Program."}
                    </p>
                  </div>
                </div>

                {/* Gallery Item 3 */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-64">
                    <img
                      src="/images/chuo/batch2-departure.webp"
                      alt="Departure of Batch 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Departure of Batch 2
                    </h3>
                    <p className="text-gray-700">
                      {isId ? "Keberangkatan Ernest dan Hauzan sebagai peserta Batch 2 Program Internasional 3+2 ke Jepang." : "Ernest and Hauzan's departure for Japan as Batch 2 participants in the 3+2 International Program."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Information */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                {isId ? "Informasi Lebih Lanjut" : "Further Information"}
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                {isId ? "Informasi persyaratan, mekanisme seleksi, dan jadwal pendaftaran akan diumumkan melalui kanal resmi Sekolah Vokasi IPB University." : "Requirements, selection procedures, and registration schedules will be announced through the official IPB Vocational School channels."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={localizedPath("/contacts")}
                  className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {isId ? "Hubungi Kami" : "Contact Us"}
                </Link>
                <Link
                  href={localizedPath("/programs/japan")}
                  className="px-8 py-4 bg-white text-orange-700 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-all"
                >
                  {isId ? "Kembali ke Program Jepang" : "Back to Japan Programs"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
