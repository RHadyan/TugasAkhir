"use client";

import { Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description: string;
  language?: "id" | "en";
}

export const ImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
  language = "id",
}: ImageModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalTitle = title || (language === "id" ? "Dokumentasi Program" : "Program Documentation");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-modal-title"
        className="grid max-h-[94vh] w-full max-w-7xl overflow-hidden rounded-lg bg-white shadow-2xl lg:grid-cols-[minmax(0,1fr)_360px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-[52vh] items-center justify-center bg-[#101820] lg:min-h-[82vh]">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={modalTitle}
              fill
              className="object-contain p-3 sm:p-6"
              sizes="(max-width: 1024px) 100vw, 75vw"
              priority
            />
          )}

          <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-2 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-xs font-medium text-white/65 backdrop-blur-sm sm:flex">
            <Expand className="h-3.5 w-3.5" />
            {language === "id" ? "Pratinjau gambar" : "Image preview"}
          </div>
        </div>

        <aside className="flex max-h-[42vh] flex-col border-t border-slate-200 bg-white lg:max-h-[82vh] lg:border-l lg:border-t-0">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#31587a]">
              {language === "id" ? "Dokumentasi" : "Documentation"}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#31587a] focus:ring-offset-2"
              aria-label={language === "id" ? "Tutup pratinjau" : "Close preview"}
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-7">
            <h2 id="image-modal-title" className="text-2xl font-bold leading-tight text-slate-950">
              {modalTitle}
            </h2>
            {description && <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-600">{description}</p>}
          </div>

          <footer className="hidden border-t border-slate-200 px-6 py-4 text-xs text-slate-500 lg:block">
            {language === "id" ? "Tekan Esc atau klik area luar untuk menutup." : "Press Esc or click outside to close."}
          </footer>
        </aside>
      </section>
    </div>
  );
};
