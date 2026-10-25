"use client";

import { use, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Footer, Header, ImageModal } from "@/app/(public)/components";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";
import { VCCBE_API_URL } from "@/lib/vccbe-config";

interface Country {
  id: string;
  name: string;
}

interface Objective {
  sticker: string;
  title: string;
  description: string;
}

interface TimelineItem {
  title: string;
  description: string;
  image?: string;
  order?: number;
}

interface ScholarshipItem {
  sticker: string;
  title: string;
  description: string;
  image?: string;
}

interface ContactPerson {
  email: string;
  phoneNumber: string;
}

interface GalleryItem {
  imageUrl: string;
  title: string;
  shortDescription: string;
}

interface CustomSectionCard {
  title: string;
  description: string;
  image?: string;
}

interface CustomSection {
  title: string;
  description: string;
  layout: "grid" | "carousel";
  cards: CustomSectionCard[];
}

interface Program {
  id: string;
  title: string;
  thumbnail: string;
  shortDescription: string;
  description: string;
  country: Country;
  objectives: Objective[];
  timeline: TimelineItem[];
  timelineDescription?: string;
  scholarshipDescription?: string;
  scholarships: ScholarshipItem[];
  contactPersons: ContactPerson[];
  gallery: GalleryItem[];
  customSections?: CustomSection[];
  eligibleStudyPrograms: string[];
  mainColor?: string;
  createdAt: string;
}

type ImageClickHandler = (image: string, title: string, description: string) => void;

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <div
        className={`mb-3 text-sm font-semibold uppercase tracking-[0.12em] ${
          light ? "text-white/70" : "text-[#31587a]"
        }`}
      >
        {eyebrow}
      </div>
      <h2
        className={`text-3xl font-bold leading-tight tracking-[-0.01em] sm:text-4xl ${
          light ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 max-w-2xl text-lg leading-8 ${light ? "text-white/65" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function CarouselButton({
  direction,
  onClick,
  label,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--program-accent)] focus:ring-offset-2"
    >
      {direction === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}

function CustomSectionRenderer({
  section,
  index,
  language,
  onImageClick,
}: {
  section: CustomSection;
  index: number;
  language: "id" | "en";
  onImageClick: ImageClickHandler;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    const firstCard = container?.firstElementChild as HTMLElement | null;
    if (!container || !firstCard) return;

    container.scrollBy({
      left: direction === "left" ? -(firstCard.offsetWidth + 24) : firstCard.offsetWidth + 24,
      behavior: "smooth",
    });
  };

  const cards = section.cards ?? [];

  return (
    <section className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={`${language === "id" ? "Bagian program" : "Program section"} ${String(index + 1).padStart(2, "0")}`}
            title={section.title}
            description={section.description}
          />
          {section.layout === "carousel" && cards.length > 1 && (
            <div className="flex gap-3">
              <CarouselButton
                direction="left"
                onClick={() => scroll("left")}
                label={language === "id" ? "Kartu sebelumnya" : "Previous card"}
              />
              <CarouselButton
                direction="right"
                onClick={() => scroll("right")}
                label={language === "id" ? "Kartu berikutnya" : "Next card"}
              />
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className={
            section.layout === "carousel"
              ? "flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {cards.map((card, cardIndex) => (
            <article
              key={`${card.title}-${cardIndex}`}
              role={card.image ? "button" : undefined}
              tabIndex={card.image ? 0 : undefined}
              onClick={() => card.image && onImageClick(card.image, card.title, card.description)}
              onKeyDown={(event) => {
                if (card.image && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onImageClick(card.image, card.title, card.description);
                }
              }}
              className={`group overflow-hidden rounded-xl border border-slate-200 bg-white ${
                section.layout === "carousel" ? "min-w-[88%] snap-start md:min-w-[48%] lg:min-w-[32%]" : ""
              } ${card.image ? "cursor-pointer" : ""}`}
            >
              {card.image && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-7">
                <div className="mb-5 text-xs font-bold tracking-[0.18em] text-[var(--program-accent)]">
                  {String(cardIndex + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold leading-tight text-slate-950">{card.title}</h3>
                {card.description && <p className="mt-4 leading-7 text-slate-600">{card.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { language, localizedPath } = useLanguage();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    imageUrl: "",
    title: "",
    description: "",
  });
  const galleryRef = useRef<HTMLDivElement>(null);

  const openModal: ImageClickHandler = (imageUrl, title, description) => {
    setModalState({ isOpen: true, imageUrl, title, description });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgram(null);
        const response = await fetch(
          `${VCCBE_API_URL}/programs/${id}?locale=${language}`,
          { cache: "no-store", signal: controller.signal },
        );
        const data = await response.json();

        if (data.success) {
          setProgram(data.data);
        } else {
          setError(language === "id" ? "Program tidak ditemukan" : "Program not found");
        }
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch program:", fetchError);
        setError(language === "id" ? "Gagal memuat data program" : "Failed to load program data");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProgram();
    return () => controller.abort();
  }, [id, language]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-5">
          <div className="text-center">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
            <p className="font-medium text-slate-600">
              {language === "id" ? "Memuat detail program..." : "Loading program details..."}
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !program) {
    return (
      <>
        <Header />
        <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-5">
          <div className="max-w-md text-center">
            <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              !
            </span>
            <h1 className="text-4xl font-bold text-slate-950">
              {language === "id" ? "Program belum tersedia" : "Program unavailable"}
            </h1>
            <p className="mt-4 text-slate-600">
              {error || (language === "id" ? "Program tidak ditemukan" : "Program not found")}
            </p>
            <Link
              href={localizedPath("/programs")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === "id" ? "Kembali ke Program" : "Back to Programs"}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const mainColor = "#31587a";
  const contacts = program.contactPersons ?? [];
  const objectives = program.objectives ?? [];
  const timeline = program.timeline ?? [];
  const scholarships = program.scholarships ?? [];
  const gallery = program.gallery ?? [];
  const customSections = program.customSections ?? [];
  const eligiblePrograms = program.eligibleStudyPrograms ?? [];
  const pageStyle = {
    "--program-accent": mainColor,
    "--program-accent-soft": `${mainColor}18`,
  } as CSSProperties;

  const scrollGallery = (direction: "left" | "right") => {
    const container = galleryRef.current;
    const firstCard = container?.firstElementChild as HTMLElement | null;
    if (!container || !firstCard) return;
    container.scrollBy({
      left: direction === "left" ? -(firstCard.offsetWidth + 24) : firstCard.offsetWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <main className="overflow-hidden bg-white text-slate-950" style={pageStyle}>
        <section className="relative isolate overflow-hidden bg-slate-50 text-slate-950">
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-12 lg:pb-28 lg:pt-16">
            <Link
              href={localizedPath("/programs")}
              className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === "id" ? "Semua program" : "All programs"}
            </Link>

            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div className="relative z-10">
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 border-l-2 border-[#31587a] pl-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-[var(--program-accent)]" />
                    {program.country.name}
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-[-0.02em] text-slate-950 sm:text-5xl">
                  {program.title}
                </h1>
                <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{program.shortDescription}</p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#overview"
                    className="group inline-flex items-center justify-center gap-3 rounded-md bg-[#31587a] px-7 py-3.5 font-bold text-white transition hover:bg-[#274864]"
                  >
                    {language === "id" ? "Jelajahi program" : "Explore program"}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </a>
                  {gallery.length > 0 && (
                    <a
                      href="#gallery"
                      className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      {language === "id" ? "Lihat galeri" : "View gallery"}
                    </a>
                  )}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200 bg-slate-200 shadow-sm">
                  <Image src={program.thumbnail} alt={program.title} fill className="object-cover" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="scroll-mt-20 bg-white">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-12 lg:py-28">
            <div>
              <SectionHeading
                eyebrow={language === "id" ? "Tentang program" : "About the program"}
                title={language === "id" ? "Gambaran program" : "Program overview"}
              />
              {eligiblePrograms.length > 0 && (
                <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {language === "id" ? "Program studi yang memenuhi syarat" : "Eligible study programs"}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {eligiblePrograms.map((studyProgram) => (
                      <span
                        key={studyProgram}
                        className="rounded-full bg-[var(--program-accent-soft)] px-4 py-2 text-sm font-bold text-slate-800"
                      >
                        {studyProgram}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-300 pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
              <div className="whitespace-pre-wrap text-lg leading-9 text-slate-700 sm:text-xl">{program.description}</div>
            </div>
          </div>
        </section>

        {objectives.length > 0 && (
          <section id="objectives" className="scroll-mt-20 border-y border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <div className="mb-14">
                <SectionHeading
                  eyebrow={language === "id" ? "Informasi program" : "Program information"}
                  title={language === "id" ? "Tujuan Program" : "Program Objectives"}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {objectives.map((objective, index) => (
                  <article
                    key={`${objective.title}-${index}`}
                    className="group relative min-h-[230px] overflow-hidden rounded-lg border border-slate-200 bg-white p-7 text-slate-950 transition duration-300 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[#31587a]" aria-hidden="true">
                          <CircleCheck className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold tracking-[0.2em] text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="mt-auto pt-16">
                        <h3 className="text-2xl font-bold leading-tight">{objective.title}</h3>
                        {objective.description && (
                          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                            {objective.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {timeline.length > 0 && (
          <section id="timeline" className="scroll-mt-20 bg-white text-slate-950">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <SectionHeading
                eyebrow={language === "id" ? "Pelaksanaan program" : "Program implementation"}
                title={language === "id" ? "Alur Program" : "Program Timeline"}
                description={program.timelineDescription}
              />

              <div className="relative mt-16">
                <div className="absolute bottom-0 left-[27px] top-0 w-px bg-slate-200 md:left-1/2" />
                <div className="space-y-8 md:space-y-4">
                  {timeline.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <article
                        key={`${item.title}-${index}`}
                        className={`relative grid items-center gap-8 pl-20 md:grid-cols-2 md:pl-0 ${
                          isEven ? "" : "md:[&>*:last-child]:col-start-2"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-7 z-10 flex h-14 w-14 items-center justify-center rounded-full border-[6px] border-white bg-[#31587a] text-lg font-bold text-white md:left-1/2 md:-translate-x-1/2 ${
                            isEven ? "" : ""
                          }`}
                        >
                          {String(item.order || index + 1).padStart(2, "0")}
                        </div>
                        <div className={`${isEven ? "md:pr-16" : "md:col-start-2 md:pl-16"} ${!isEven ? "md:row-start-1" : ""}`}>
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-7">
                            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                              <Clock3 className="h-4 w-4 text-[var(--program-accent)]" />
                              {language === "id" ? "Tahap program" : "Program stage"}
                            </div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            {item.description && <p className="mt-4 leading-7 text-slate-600">{item.description}</p>}
                            {item.image && (
                              <button
                                type="button"
                                onClick={() => openModal(item.image!, item.title, item.description)}
                                className="relative mt-6 block aspect-[16/9] w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--program-accent)]"
                              >
                                <Image src={item.image} alt={item.title} fill className="object-cover transition hover:scale-105" />
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {(scholarships.length > 0 || program.scholarshipDescription) && (
          <section id="scholarship" className="scroll-mt-20 border-y border-slate-200 bg-slate-50 text-slate-950">
            <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-28">
              <div>
                <SectionHeading
                  eyebrow={language === "id" ? "Dukungan program" : "Program support"}
                  title={language === "id" ? "Beasiswa & dukungan keuangan" : "Scholarship & financial support"}
                />
                {program.scholarshipDescription && (
                  <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{program.scholarshipDescription}</p>
                )}
              </div>

              <div className="space-y-4">
                {scholarships.map((scholarship, index) => (
                  <article
                    key={`${scholarship.title}-${index}`}
                    className="grid gap-6 rounded-lg border border-slate-200 bg-white p-7 md:grid-cols-[auto_1fr]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-[#31587a]">
                      <CircleCheck className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{scholarship.title}</h3>
                      {scholarship.description && <p className="mt-3 leading-7 text-slate-600">{scholarship.description}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {customSections.map((section, index) => (
          <CustomSectionRenderer
            key={`${section.title}-${index}`}
            section={section}
            index={index}
            language={language}
            onImageClick={openModal}
          />
        ))}

        {gallery.length > 0 && (
          <section id="gallery" className="scroll-mt-20 bg-white">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
              <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-slate-950 sm:text-4xl">
                  {language === "id" ? "Dokumentasi" : "Documentation"}
                </h2>
                {gallery.length > 1 && (
                  <div className="flex gap-3">
                    <CarouselButton
                      direction="left"
                      onClick={() => scrollGallery("left")}
                      label={language === "id" ? "Foto sebelumnya" : "Previous photo"}
                    />
                    <CarouselButton
                      direction="right"
                      onClick={() => scrollGallery("right")}
                      label={language === "id" ? "Foto berikutnya" : "Next photo"}
                    />
                  </div>
                )}
              </div>

              <div
                ref={galleryRef}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {gallery.map((item, index) => (
                  <button
                    type="button"
                    key={`${item.imageUrl}-${index}`}
                    onClick={() => openModal(item.imageUrl, item.title, item.shortDescription)}
                    className="group min-w-[88%] snap-start overflow-hidden rounded-lg border border-slate-200 bg-white text-left focus:outline-none focus:ring-2 focus:ring-[var(--program-accent)] focus:ring-offset-4 md:min-w-[48%] lg:min-w-[38%]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || `${language === "id" ? "Dokumentasi program" : "Program documentation"} ${index + 1}`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                      <span className="absolute bottom-5 left-5 text-xs font-bold tracking-[0.2em] text-white/70">
                        {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                      </span>
                    </div>
                    {(item.title || item.shortDescription) && (
                      <div className="p-6">
                        {item.title && <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>}
                        {item.shortDescription && <p className="mt-3 line-clamp-2 leading-7 text-slate-600">{item.shortDescription}</p>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="relative overflow-hidden rounded-lg bg-[#14283b] px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
              <div className="relative grid gap-14 lg:grid-cols-[1fr_.85fr] lg:items-end">
                <div>
                  <span className="mb-5 block text-sm font-semibold uppercase tracking-[0.12em] text-white/65">
                    {language === "id" ? "Informasi pendaftaran" : "Registration information"}
                  </span>
                  <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-5xl">
                    {language === "id" ? "Pendaftaran dan Informasi Program" : "Program Registration and Information"}
                  </h2>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                    {language === "id"
                      ? "Hubungi tim kami untuk informasi pendaftaran, persyaratan, dan jadwal program."
                      : "Talk to our team about registration, detailed requirements, and the program schedule."}
                  </p>
                </div>

                <div className="space-y-3">
                  {contacts.flatMap((contact, index) => {
                    const methods = [];
                    if (contact.phoneNumber) {
                      methods.push(
                        <a
                          key={`phone-${index}`}
                          href={`https://wa.me/${contact.phoneNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] p-5 transition hover:bg-white/[0.12]"
                        >
                          <span className="flex items-center gap-4">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white">
                              <MessageCircle className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-white/40">WhatsApp</span>
                              <span className="mt-1 block font-semibold">{contact.phoneNumber}</span>
                            </span>
                          </span>
                          <ArrowUpRight className="h-5 w-5 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        </a>,
                      );
                    }
                    if (contact.email) {
                      methods.push(
                        <a
                          key={`email-${index}`}
                          href={`mailto:${contact.email}`}
                          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] p-5 transition hover:bg-white/[0.12]"
                        >
                          <span className="flex min-w-0 items-center gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--program-accent)] text-white">
                              <Mail className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-white/40">Email</span>
                              <span className="mt-1 block truncate font-semibold">{contact.email}</span>
                            </span>
                          </span>
                          <ArrowUpRight className="ml-3 h-5 w-5 shrink-0 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                        </a>,
                      );
                    }
                    return methods;
                  })}

                  {contacts.length === 0 && (
                    <Link
                      href={localizedPath("/contacts")}
                      className="group flex items-center justify-between rounded-2xl bg-white p-5 font-bold text-slate-950 transition hover:-translate-y-0.5"
                    >
                      {language === "id" ? "Hubungi tim VCC" : "Contact the VCC team"}
                      <ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}

                  <Link
                    href={localizedPath("/programs")}
                    className="group flex items-center justify-between rounded-2xl border border-white/15 p-5 font-bold text-white transition hover:bg-white/[0.07]"
                  >
                    {language === "id" ? "Jelajahi program lainnya" : "Explore other programs"}
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ImageModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((current) => ({ ...current, isOpen: false }))}
        imageUrl={modalState.imageUrl}
        title={modalState.title}
        description={modalState.description}
        language={language}
      />
      <Footer />
    </>
  );
}
