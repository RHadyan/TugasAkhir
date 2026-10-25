"use client";

import { Header, Footer } from "@/app/(public)/components";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";
import {
	ArrowUpRight,
	Clock3,
	Instagram,
	Mail,
	MapPin,
	MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ContactCardProps = {
	href: string;
	icon: LucideIcon;
	label: string;
	value: string;
	action: string;
	external?: boolean;
};

function ContactCard({
	href,
	icon: Icon,
	label,
	value,
	action,
	external = false,
}: ContactCardProps) {
	return (
		<a
			href={href}
			target={external ? "_blank" : undefined}
			rel={external ? "noopener noreferrer" : undefined}
			className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg md:p-7"
		>
			<span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-100">
				<Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
			</span>
			<h3 className="mt-6 text-lg font-semibold text-slate-900">{label}</h3>
			<p className="mt-2 break-words text-sm leading-6 font-medium text-slate-600">
				{value}
			</p>
			<span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-blue-700">
				{action}
				<ArrowUpRight
					aria-hidden="true"
					className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
				/>
			</span>
		</a>
	);
}

function ContactsPageContent() {
	const { language } = useLanguage();
	const isId = language === "id";

	return (
		<main className="bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<header className="mx-auto mb-12 max-w-3xl text-center">
					<h1 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
						{isId ? "Kontak dan Informasi Resmi" : "Official Contact Information"}
					</h1>
					<p className="mx-auto max-w-2xl text-lg leading-8 text-slate-700">
						{isId
							? "Hubungi tim kami untuk informasi program, peluang kolaborasi, dan layanan kerja sama Sekolah Vokasi IPB University."
							: "Contact our team for program information, collaboration opportunities, and partnership services at IPB University Vocational School."}
					</p>
				</header>

				<section aria-labelledby="contact-channels-title">
					<h2
						id="contact-channels-title"
						className="mb-7 text-2xl font-bold text-slate-900 sm:text-3xl"
					>
						{isId ? "Kanal Kontak" : "Contact Channels"}
					</h2>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<ContactCard
							href="https://wa.me/6282299273968"
							icon={MessageCircle}
							label="WhatsApp"
							value="+62 822-9927-3968"
							action={isId ? "Mulai percakapan" : "Start a conversation"}
							external
						/>
						<ContactCard
							href="mailto:svipb-partneship@apps.ipb.ac.id"
							icon={Mail}
							label="Email"
							value="svipb-partneship@apps.ipb.ac.id"
							action={isId ? "Kirim email" : "Send an email"}
						/>
						<ContactCard
							href="https://www.instagram.com/collaboration.svipb/"
							icon={Instagram}
							label="Instagram"
							value="@collaboration.svipb"
							action={isId ? "Lihat profil" : "View profile"}
							external
						/>

						<article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
							<span className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
								<MapPin aria-hidden="true" className="size-6" strokeWidth={1.8} />
							</span>
							<h3 className="mt-6 text-lg font-semibold text-slate-900">
								{isId ? "Alamat Kantor" : "Office Address"}
							</h3>
							<address className="mt-2 text-sm leading-6 font-medium text-slate-600 not-italic">
								Jl. Kumbang No. 14, RT 02/RW 06
								<br />
								Kota Bogor, Jawa Barat 16128
							</address>
						</article>
					</div>
				</section>

				<section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
					<div className="min-h-[400px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
						<iframe
							title={isId ? "Peta lokasi Sekolah Vokasi IPB" : "IPB Vocational School location map"}
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4628251636286!2d106.80611479999999!3d-6.5892504999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5d2e602b501%3A0x25a12f0f97fac4ee!2sSekolah%20Vokasi%20Institut%20Pertanian%20Bogor!5e0!3m2!1sid!2sid!4v1767563696590!5m2!1sid!2sid"
							className="h-full min-h-[400px] w-full border-0"
							loading="lazy"
							allowFullScreen
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</div>

					<aside className="flex flex-col justify-center rounded-2xl border border-blue-100 bg-blue-50 p-7 md:p-9">
						<span className="flex size-12 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
							<Clock3 aria-hidden="true" className="size-6" strokeWidth={1.8} />
						</span>
						<p className="mt-7 text-sm font-semibold text-blue-700">
							{isId ? "Jam Operasional" : "Office Hours"}
						</p>
						<h2 className="mt-2 text-2xl font-bold text-slate-900">
							{isId ? "Senin–Jumat" : "Monday–Friday"}
						</h2>
						<p className="mt-2 text-lg font-semibold text-slate-700">08.00–16.00 WIB</p>
						<p className="mt-6 border-t border-blue-200 pt-6 text-sm leading-6 text-slate-600">
							{isId
								? "Layanan kantor tutup pada Sabtu, Minggu, dan hari libur nasional."
								: "Office services are closed on Saturdays, Sundays, and national holidays."}
						</p>
					</aside>
				</section>
			</div>
		</main>
	);
}

export default function ContactsPage() {
	return (
		<div className="min-h-screen bg-white">
			<Header />
			<ContactsPageContent />
			<Footer />
		</div>
	);
}
