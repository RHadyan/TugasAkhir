"use client";

import { Header, Footer } from "@/app/(public)/components";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function JapanProgramsPage() {
	const { language, localizedPath } = useLanguage();
	const isId = language === "id";
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<main className="py-14 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
							{isId ? "Program Jepang" : "Japan Programs"}
						</h1>
						<p className="text-slate-700 text-lg max-w-2xl mx-auto">
							{isId
								? "Komisi Kerja Sama SV IPB menyediakan berbagai program untuk mendukung studi, karier, dan pekerja migran Indonesia di Jepang."
								: "The IPB Vocational School Cooperation Commission provides programs supporting study, careers, and Indonesian migrant workers in Japan."}
						</p>
					</div>

					{/* Cards Grid - Changed to 3 columns */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-stretch">
						{/* Card 1: Pekerja Migran Aceh */}
						<div className="rounded-3xl p-3 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
							<div className="rounded-2xl overflow-hidden bg-white shadow-inner h-full flex flex-col">
								{/* Header */}
								<div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-8 relative overflow-hidden min-h-[120px] flex items-center">
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
									</div>
									<h2 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight relative z-10 drop-shadow-md">
										{isId ? "Pekerja Migran Aceh" : "Aceh Migrant Workers"}
									</h2>
								</div>

								{/* Image */}
								<div className="relative w-full h-48 bg-slate-200">
									<Image
										// src="/images/programs/pekerja-migran-aceh.webp"
										src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1000"
										alt={isId ? "Pekerja Migran Aceh" : "Aceh Migrant Workers"}
										fill
										className="object-cover"
									/>
								</div>

								{/* Content */}
								<div className="bg-gradient-to-b from-white to-slate-50 p-5 sm:px-6 sm:py-8 flex flex-col flex-1">
									<p className="text-slate-600 leading-relaxed flex-1 text-base mb-6">
										{isId
											? "Program khusus untuk pekerja migran dari Aceh yang bekerja di Jepang. Kami menyediakan pendampingan, konsultasi, dan dukungan untuk melindungi kesejahteraan serta hak mereka."
											: "A dedicated program for migrant workers from Aceh in Japan, providing guidance, consultation, and support to protect their welfare and rights."}
									</p>

									<Link
										href={localizedPath("/pekerjamigranaceh")}
										className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 py-3.5 text-base font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
									>
										{isId ? "Selengkapnya" : "Learn More"}
									</Link>
								</div>
							</div>
						</div>

						{/* Card 2: PPBJ */}
						<div className="rounded-3xl p-3 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
							<div className="rounded-2xl overflow-hidden bg-white shadow-inner h-full flex flex-col">
								{/* Header */}
								<div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-8 relative overflow-hidden min-h-[120px] flex items-center">
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
									</div>
									<h2 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight relative z-10 drop-shadow-md">
										PPBJ
									</h2>
								</div>

								{/* Image */}
								<div className="relative w-full h-48 bg-slate-200">
									<Image
										src="/images/programs/ppbj.webp"
										alt="PPBJ"
										fill
										className="object-cover"
									/>
								</div>

								{/* Content */}
								<div className="bg-gradient-to-b from-white to-slate-50 p-5 sm:px-6 sm:py-8 flex flex-col flex-1">
									<p className="text-slate-600 leading-relaxed flex-1 text-base mb-6">
										{isId
											? "Program Pelatihan Bahasa Jepang (PPBJ) adalah program resmi Sekolah Vokasi IPB untuk pembelajaran bahasa, persiapan sertifikasi, studi, dan karier di Jepang."
											: "PPBJ is the official Japanese language training program of IPB Vocational School for language learning, certification, study, and career preparation in Japan."}
									</p>

									<Link
										href={localizedPath("/programs/japan/ppbj")}
										className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 py-3.5 text-base font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
									>
										{isId ? "Selengkapnya" : "Learn More"}
									</Link>
								</div>
							</div>
						</div>

						{/* Card 3: Joint Degree 3+2 Chuo */}
						<div className="rounded-3xl p-3 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
							<div className="rounded-2xl overflow-hidden bg-white shadow-inner h-full flex flex-col">
								{/* Header */}
								<div className="bg-gradient-to-br from-orange-600 to-orange-700 px-6 py-8 relative overflow-hidden min-h-[120px] flex items-center">
									<div className="absolute inset-0 opacity-10">
										<div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
									</div>
									<h2 className="text-white font-extrabold text-2xl sm:text-3xl leading-tight relative z-10 drop-shadow-md">
										Joint Degree 3+2 Chuo
									</h2>
								</div>

								{/* Image */}
								<div className="relative w-full h-48 bg-slate-200">
									<Image
										src="/images/programs/chuo.webp"
										alt="Joint Degree 3+2 Chuo"
										fill
										className="object-cover"
									/>
								</div>

								{/* Content */}
								<div className="bg-gradient-to-b from-white to-slate-50 p-5 sm:px-6 sm:py-8 flex flex-col flex-1">
									<p className="text-slate-600 leading-relaxed flex-1 text-base mb-6">
										{isId
											? "Program Internasional skema 3+2 bersama Chuo Joho Institute Jepang, yang membekali mahasiswa dengan kompetensi akademik, keterampilan kerja, serta pemahaman budaya dan etos kerja Jepang."
											: "A 3+2 international program with Chuo Joho Institute in Japan, equipping students with academic competence, workplace skills, and an understanding of Japanese culture and work ethics."}
									</p>

									<Link
										href={localizedPath("/programs/japan/chuo")}
										className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transition-all duration-300 py-3.5 text-base font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
									>
										{isId ? "Selengkapnya" : "Learn More"}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
