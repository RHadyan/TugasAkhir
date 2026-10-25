import { prisma } from "../lib/prisma";
import {
  ensureProgramStructureDeterministic,
  translationData,
} from "../lib/content-i18n";

async function backfillCountries() {
  const countries = await prisma.country.findMany({
    select: { id: true, name: true },
  });

  for (const country of countries) {
    await prisma.$transaction([
      prisma.countryTranslation.upsert({
        where: {
          countryId_locale: { countryId: country.id, locale: "id" },
        },
        create: {
          countryId: country.id,
          locale: "id",
          name: country.name,
        },
        update: { name: country.name },
      }),
      prisma.countryTranslation.upsert({
        where: {
          countryId_locale: { countryId: country.id, locale: "en" },
        },
        create: {
          countryId: country.id,
          locale: "en",
          name: null,
        },
        update: {},
      }),
    ]);
  }

  return countries.length;
}

async function backfillPrograms() {
  const programs = await prisma.program.findMany();

  for (const program of programs) {
    const objectives = ensureProgramStructureDeterministic(
      program.objectives,
      program.id,
      "objective",
    );
    const timeline = ensureProgramStructureDeterministic(
      program.timeline,
      program.id,
      "timeline",
    );
    const scholarships = ensureProgramStructureDeterministic(
      program.scholarships,
      program.id,
      "scholarship",
    );
    const customSections = ensureProgramStructureDeterministic(
      program.customSections,
      program.id,
      "section",
    );
    const gallery = ensureProgramStructureDeterministic(
      program.gallery,
      program.id,
      "gallery",
    );

    const indonesian = translationData({
      title: program.title,
      shortDescription: program.shortDescription,
      description: program.description,
      timelineDescription: program.timelineDescription,
      scholarshipDescription: program.scholarshipDescription,
      objectives,
      timeline,
      scholarships,
      customSections,
      gallery,
    });

    await prisma.$transaction([
      prisma.program.update({
        where: { id: program.id },
        data: {
          objectives,
          timeline,
          scholarships,
          customSections,
          gallery,
        },
      }),
      prisma.programTranslation.upsert({
        where: {
          programId_locale: { programId: program.id, locale: "id" },
        },
        create: {
          programId: program.id,
          locale: "id",
          ...indonesian,
        },
        update: indonesian,
      }),
      prisma.programTranslation.upsert({
        where: {
          programId_locale: { programId: program.id, locale: "en" },
        },
        create: {
          programId: program.id,
          locale: "en",
          ...translationData({}),
        },
        update: {},
      }),
    ]);
  }

  return programs.length;
}

async function main() {
  const countries = await backfillCountries();
  const programs = await backfillPrograms();
  const [
    indonesianCountries,
    englishCountries,
    indonesianPrograms,
    englishPrograms,
  ] = await Promise.all([
    prisma.countryTranslation.count({ where: { locale: "id" } }),
    prisma.countryTranslation.count({ where: { locale: "en" } }),
    prisma.programTranslation.count({ where: { locale: "id" } }),
    prisma.programTranslation.count({ where: { locale: "en" } }),
  ]);

  if (
    indonesianCountries !== countries ||
    englishCountries !== countries ||
    indonesianPrograms !== programs ||
    englishPrograms !== programs
  ) {
    throw new Error(
      `Backfill verification failed: countries=${countries}/${indonesianCountries}/${englishCountries}, programs=${programs}/${indonesianPrograms}/${englishPrograms}`,
    );
  }

  console.log(
    `Translation backfill verified: ${countries} countries and ${programs} programs each have id/en rows.`,
  );
}

main()
  .catch((error) => {
    console.error("Translation backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
