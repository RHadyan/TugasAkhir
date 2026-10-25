"use client";

import Link from "next/link";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function Footer() {
  const { language, localizedPath, t } = useLanguage();
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === "id"
                ? "Komisi Kerja Sama Sekolah Vokasi IPB"
                : "IPB Vocational School Cooperation Commission"}
            </h3>
            <p className="text-gray-300 text-sm">
              {language === "id"
                ? "Memfasilitasi kolaborasi internasional untuk meningkatkan kualitas pendidikan vokasi dan membuka peluang global bagi mahasiswa."
                : "Facilitating international collaboration to strengthen vocational education and open global opportunities for students."}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footerQuickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localizedPath("/")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedPath("/about")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedPath("/programs")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {t("programs")}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedPath("/contacts")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {language === "id" ? "Program Kami" : "Our Programs"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={localizedPath("/programs/japan/ppbj")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  PPBJ SV IPB
                </Link>
              </li>
              <li>
                <Link
                  href={localizedPath("/pekerjamigranaceh")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {language === "id" ? "Pekerja Migran Aceh" : "Aceh Migrant Workers"}
                </Link>
              </li>
              <li>
                <Link
                  href={localizedPath("/programs")}
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
                >
                  {language === "id" ? "Semua Program" : "All Programs"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("contact")}</h3>
            <address className="text-gray-300 text-sm not-italic">
              <p>{t("footerCommission")}</p>
              <p>{t("footerUniversity")}</p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:kerjasama@apps.ipb.ac.id"
                  className="hover:text-white transition-colors"
                >
                  kerjasama@apps.ipb.ac.id
                </a>
              </p>
              <p>
                {language === "id" ? "Telepon" : "Phone"}:{" "}
                <a
                  href="tel:+622518629442"
                  className="hover:text-white transition-colors"
                >
                  +62 251 8629442
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {"©"} {new Date().getFullYear()} {t("footerCommission")}{" "}
            {t("footerUniversity")}.{" "}
            {language === "id" ? "Hak cipta dilindungi." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
