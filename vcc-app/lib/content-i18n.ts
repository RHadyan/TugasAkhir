import { randomUUID } from "node:crypto";

export const SUPPORTED_LOCALES = ["id", "en"] as const;
export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

type JsonRecord = Record<string, any>;

export interface ProgramTranslationInput {
  title?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  timelineDescription?: string | null;
  scholarshipDescription?: string | null;
  objectives?: JsonRecord[];
  timeline?: JsonRecord[];
  scholarships?: JsonRecord[];
  customSections?: JsonRecord[];
  gallery?: JsonRecord[];
}

export type ProgramTranslationsInput = Partial<
  Record<LocaleCode, ProgramTranslationInput>
>;

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function parseLocale(value: string | null): LocaleCode | null {
  if (value === null || value === "") return "id";
  return SUPPORTED_LOCALES.includes(value as LocaleCode)
    ? (value as LocaleCode)
    : null;
}

export function parseTranslations(
  value: FormDataEntryValue | null,
): ProgramTranslationsInput {
  if (typeof value !== "string" || value.trim() === "") return {};

  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("translations must be an object");
  }

  return parsed as ProgramTranslationsInput;
}

function withStableKeys(
  value: unknown,
  prefix: string,
  createKey: (prefix: string, index: number) => string,
): JsonRecord[] {
  if (!Array.isArray(value)) return [];

  return value.map((rawItem, index) => {
    const item =
      rawItem && typeof rawItem === "object" ? { ...rawItem } : {};
    const key = hasText(item._key)
      ? item._key
      : createKey(prefix, index);

    if (Array.isArray(item.cards)) {
      item.cards = withStableKeys(
        item.cards,
        `${key}-card`,
        createKey,
      );
    }

    return { ...item, _key: key };
  });
}

export function ensureProgramStructure(
  value: unknown,
  prefix: string,
): JsonRecord[] {
  return withStableKeys(value, prefix, () => randomUUID());
}

export function ensureProgramStructureDeterministic(
  value: unknown,
  programId: string,
  prefix: string,
): JsonRecord[] {
  return withStableKeys(
    value,
    prefix,
    (itemPrefix, index) =>
      itemPrefix.startsWith(`${programId}-`)
        ? `${itemPrefix}-${index}`
        : `${programId}-${itemPrefix}-${index}`,
  );
}

function findOverlay(
  items: unknown,
  key: string,
  index: number,
): JsonRecord | undefined {
  if (!Array.isArray(items)) return undefined;
  return (
    items.find(
      (item) =>
        item &&
        typeof item === "object" &&
        (item as JsonRecord)._key === key,
    ) ??
    (items[index] &&
    typeof items[index] === "object"
      ? (items[index] as JsonRecord)
      : undefined)
  );
}

function mergeTranslatedArray(
  baseValue: unknown,
  requestedValue: unknown,
  indonesianValue: unknown,
  textFields: string[],
  nestedCards = false,
): JsonRecord[] {
  if (!Array.isArray(baseValue)) return [];

  return baseValue.map((rawItem, index) => {
    const base =
      rawItem && typeof rawItem === "object" ? { ...rawItem } : {};
    const key = hasText(base._key) ? base._key : `legacy-${index}`;
    const requested = findOverlay(requestedValue, key, index);
    const indonesian = findOverlay(indonesianValue, key, index);
    const merged: JsonRecord = { ...base, _key: key };

    for (const field of textFields) {
      merged[field] = hasText(requested?.[field])
        ? requested?.[field]
        : hasText(indonesian?.[field])
          ? indonesian?.[field]
          : base[field] ?? "";
    }

    if (nestedCards && Array.isArray(base.cards)) {
      merged.cards = mergeTranslatedArray(
        base.cards,
        requested?.cards,
        indonesian?.cards,
        ["title", "description"],
      );
    }

    return merged;
  });
}

function translationMap(program: JsonRecord) {
  const map: Partial<Record<LocaleCode, JsonRecord>> = {};
  if (!Array.isArray(program.translations)) return map;

  for (const translation of program.translations) {
    if (
      translation &&
      SUPPORTED_LOCALES.includes(translation.locale as LocaleCode)
    ) {
      map[translation.locale as LocaleCode] = translation;
    }
  }
  return map;
}

export function serializeTranslations(program: JsonRecord) {
  const map = translationMap(program);
  return {
    id: map.id ?? null,
    en: map.en ?? null,
  };
}

export function resolveCountry(country: JsonRecord, locale: LocaleCode) {
  const translations = Array.isArray(country.translations)
    ? country.translations
    : [];
  const requested = translations.find(
    (translation: JsonRecord) => translation.locale === locale,
  );
  const indonesian = translations.find(
    (translation: JsonRecord) => translation.locale === "id",
  );

  const { translations: _translations, ...rest } = country;
  return {
    ...rest,
    name: hasText(requested?.name)
      ? requested.name
      : hasText(indonesian?.name)
        ? indonesian.name
        : country.name,
  };
}

export function serializeCountryTranslations(country: JsonRecord) {
  const translations = Array.isArray(country.translations)
    ? country.translations
    : [];
  const byLocale = (locale: LocaleCode) =>
    translations.find(
      (translation: JsonRecord) => translation.locale === locale,
    );

  return {
    id: { name: byLocale("id")?.name ?? country.name },
    en: { name: byLocale("en")?.name ?? null },
  };
}

export function resolveProgram(program: JsonRecord, locale: LocaleCode) {
  const map = translationMap(program);
  const requested = map[locale];
  const indonesian = map.id;
  const { translations: _translations, country, ...rest } = program;

  const text = (field: string) =>
    hasText(requested?.[field])
      ? requested?.[field]
      : hasText(indonesian?.[field])
        ? indonesian?.[field]
        : program[field] ?? null;

  return {
    ...rest,
    title: text("title"),
    shortDescription: text("shortDescription"),
    description: text("description"),
    timelineDescription: text("timelineDescription"),
    scholarshipDescription: text("scholarshipDescription"),
    objectives: mergeTranslatedArray(
      program.objectives,
      requested?.objectives,
      indonesian?.objectives,
      ["title", "description"],
    ),
    timeline: mergeTranslatedArray(
      program.timeline,
      requested?.timeline,
      indonesian?.timeline,
      ["title", "description"],
    ),
    scholarships: mergeTranslatedArray(
      program.scholarships,
      requested?.scholarships,
      indonesian?.scholarships,
      ["title", "description"],
    ),
    customSections: mergeTranslatedArray(
      program.customSections,
      requested?.customSections,
      indonesian?.customSections,
      ["title", "description"],
      true,
    ),
    gallery: mergeTranslatedArray(
      program.gallery,
      requested?.gallery,
      indonesian?.gallery,
      ["title", "shortDescription"],
    ),
    country: country ? resolveCountry(country, locale) : country,
  };
}

export function translationData(input: ProgramTranslationInput) {
  const nullableText = (value: unknown) =>
    hasText(value) ? value.trim() : null;
  const overlay = (
    value: unknown,
    fields: Array<"title" | "description" | "shortDescription">,
    nestedCards = false,
  ) =>
    Array.isArray(value)
      ? value.map((rawItem) => {
          const item =
            rawItem && typeof rawItem === "object"
              ? (rawItem as JsonRecord)
              : {};
          const translated: JsonRecord = {
            _key: hasText(item._key) ? item._key : randomUUID(),
          };
          for (const field of fields) {
            translated[field] = nullableText(item[field]);
          }
          if (nestedCards) {
            translated.cards = overlay(
              item.cards,
              ["title", "description"],
            );
          }
          return translated;
        })
      : [];

  return {
    title: nullableText(input.title),
    shortDescription: nullableText(input.shortDescription),
    description: nullableText(input.description),
    timelineDescription: nullableText(input.timelineDescription),
    scholarshipDescription: nullableText(input.scholarshipDescription),
    objectives: overlay(input.objectives, ["title", "description"]),
    timeline: overlay(input.timeline, ["title", "description"]),
    scholarships: overlay(input.scholarships, ["title", "description"]),
    customSections: overlay(
      input.customSections,
      ["title", "description"],
      true,
    ),
    gallery: overlay(input.gallery, ["title", "shortDescription"]),
  };
}

export function translationCreateData(
  translations: ProgramTranslationsInput,
  legacy: ProgramTranslationInput,
) {
  const submittedIndonesian = translations.id ?? {};
  const indonesian: ProgramTranslationInput = {
    title: hasText(submittedIndonesian.title)
      ? submittedIndonesian.title
      : legacy.title,
    shortDescription: hasText(submittedIndonesian.shortDescription)
      ? submittedIndonesian.shortDescription
      : legacy.shortDescription,
    description: hasText(submittedIndonesian.description)
      ? submittedIndonesian.description
      : legacy.description,
    timelineDescription: hasText(submittedIndonesian.timelineDescription)
      ? submittedIndonesian.timelineDescription
      : legacy.timelineDescription,
    scholarshipDescription: hasText(
      submittedIndonesian.scholarshipDescription,
    )
      ? submittedIndonesian.scholarshipDescription
      : legacy.scholarshipDescription,
    objectives: Array.isArray(submittedIndonesian.objectives)
      ? submittedIndonesian.objectives
      : legacy.objectives,
    timeline: Array.isArray(submittedIndonesian.timeline)
      ? submittedIndonesian.timeline
      : legacy.timeline,
    scholarships: Array.isArray(submittedIndonesian.scholarships)
      ? submittedIndonesian.scholarships
      : legacy.scholarships,
    customSections: Array.isArray(submittedIndonesian.customSections)
      ? submittedIndonesian.customSections
      : legacy.customSections,
    gallery: Array.isArray(submittedIndonesian.gallery)
      ? submittedIndonesian.gallery
      : legacy.gallery,
  };

  return ([
    ["id", indonesian],
    ["en", translations.en ?? {}],
  ] as const).map(([locale, input]) => ({
    locale,
    ...translationData(input),
  }));
}

export function indonesianTranslationData(
  translations: ProgramTranslationsInput,
  legacy: ProgramTranslationInput,
) {
  return translationCreateData(translations, legacy)[0];
}

export function buildLegacyTranslation(
  program: ProgramTranslationInput,
): ProgramTranslationInput {
  return {
    title: program.title,
    shortDescription: program.shortDescription,
    description: program.description,
    timelineDescription: program.timelineDescription,
    scholarshipDescription: program.scholarshipDescription,
    objectives: program.objectives ?? [],
    timeline: program.timeline ?? [],
    scholarships: program.scholarships ?? [],
    customSections: program.customSections ?? [],
    gallery: program.gallery ?? [],
  };
}
