import type { Metadata } from "next";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Pemeliharaan Sistem | VCC SV IPB",
	description:
		"Portal Vocational Collaboration Center Sekolah Vokasi IPB sedang dalam pemeliharaan.",
	alternates: {
		canonical: "/maintenance",
	},
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			index: false,
			follow: false,
			noimageindex: true,
		},
	},
};

export default function MaintenancePage() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-[#f3f5f7] px-5 py-10 text-[#172235] sm:px-8">
			<section
				aria-labelledby="maintenance-title"
				className="w-full max-w-3xl border border-[#dce1e6] bg-white px-6 py-8 shadow-[0_18px_50px_rgba(23,34,53,0.07)] sm:px-10 sm:py-10 lg:px-14 lg:py-12"
			>
				<header className="flex items-center justify-between gap-6 border-b border-[#e5e8eb] pb-7">
					<Image
						src="/images/logo/vcc-horizontal.jpg"
						alt="Vocational Collaboration Center Sekolah Vokasi IPB"
						width={238}
						height={80}
						className="h-auto w-[180px] sm:w-[220px]"
						priority
					/>
					<p className="hidden text-right text-[11px] leading-5 font-semibold tracking-[0.14em] text-[#637083] uppercase sm:block">
						Sekolah Vokasi
						<br />
						IPB University
					</p>
				</header>

				<div className="pt-9 sm:pt-11">
					<p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.11em] text-[#586577] uppercase">
						<span
							aria-hidden="true"
							className="size-2 rounded-full bg-[#b7862c]"
						/>
						Pemeliharaan Sistem
					</p>

					<h1
						id="maintenance-title"
						className="max-w-2xl font-serif text-3xl leading-[1.2] font-semibold tracking-[-0.025em] text-[#142238] sm:text-4xl"
					>
						Layanan sedang dalam pemeliharaan.
					</h1>

					<div className="mt-7 max-w-2xl space-y-4 text-[15px] leading-7 text-[#4d5969] sm:text-base">
						<p>
							Kami sedang melakukan pembaruan untuk menjaga keandalan dan
							kualitas layanan. Portal akan tersedia kembali setelah proses
							pemeliharaan selesai.
						</p>
						<p lang="en" className="text-[#6a7482]">
							We are currently performing updates to maintain service
							reliability and quality. The portal will be available again once
							the maintenance is complete.
						</p>
					</div>
				</div>

				<footer className="mt-10 border-t border-[#e5e8eb] pt-6 sm:mt-12">
					<p className="text-xs font-semibold tracking-[0.08em] text-[#7a8491] uppercase">
						Informasi dan bantuan
					</p>
					<div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<a
							href="https://wa.me/622518629442"
							target="_blank"
							rel="noreferrer"
							aria-label="Hubungi VCC melalui WhatsApp di +62 251 8629442"
							className="inline-flex min-h-11 items-center gap-3 bg-[#243b5a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#182c47] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#243b5a]"
						>
							<MessageCircle aria-hidden="true" className="size-4" />
							<span>WhatsApp</span>
							<span
								aria-hidden="true"
								className="border-l border-white/25 pl-3 font-medium text-white/85"
							>
								+62 251 8629442
							</span>
						</a>
						<a
							href="mailto:kerjasama@apps.ipb.ac.id"
							className="text-sm font-semibold text-[#243b5a] underline decoration-[#b8c0ca] underline-offset-4 transition-colors hover:text-[#0e223d] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#243b5a]"
						>
							kerjasama@apps.ipb.ac.id
						</a>
					</div>
				</footer>
			</section>
		</main>
	);
}
