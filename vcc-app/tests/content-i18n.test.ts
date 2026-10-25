import assert from "node:assert/strict";
import test from "node:test";
import {
  ensureProgramStructureDeterministic,
  parseLocale,
  resolveCountry,
  resolveProgram,
  translationData,
} from "../lib/content-i18n.ts";

test("locale parser defaults to Indonesian and rejects unsupported values", () => {
  assert.equal(parseLocale(null), "id");
  assert.equal(parseLocale(""), "id");
  assert.equal(parseLocale("en"), "en");
  assert.equal(parseLocale("fr"), null);
});

test("translation payload keeps text overlays but strips shared media and layout", () => {
  const data = translationData({
    timeline: [
      {
        _key: "step-1",
        title: "Title",
        description: "Description",
        image: "https://example.com/image.webp",
        order: 2,
      },
    ],
    customSections: [
      {
        _key: "section-1",
        title: "Section",
        description: "Description",
        layout: "carousel",
        cards: [
          {
            _key: "card-1",
            title: "Card",
            description: "Card description",
            image: "https://example.com/card.webp",
          },
        ],
      },
    ],
  });

  assert.deepEqual(data.timeline[0], {
    _key: "step-1",
    title: "Title",
    description: "Description",
  });
  assert.equal("layout" in data.customSections[0], false);
  assert.equal("image" in data.customSections[0].cards[0], false);
});

test("deterministic backfill keeps stable keys when run twice", () => {
  const legacy = [
    {
      title: "Section",
      cards: [{ title: "Card" }],
    },
  ];
  const first = ensureProgramStructureDeterministic(
    legacy,
    "program-1",
    "section",
  );
  const second = ensureProgramStructureDeterministic(
    first,
    "program-1",
    "section",
  );

  assert.deepEqual(second, first);
  assert.equal(first[0]._key, "program-1-section-0");
  assert.equal(first[0].cards[0]._key, "program-1-section-0-card-0");
});

test("country resolution falls back requested locale to Indonesian to legacy", () => {
  const country = {
    id: "country-1",
    name: "Legacy Jepang",
    translations: [
      { locale: "id", name: "Jepang" },
      { locale: "en", name: null },
    ],
  };

  assert.equal(resolveCountry(country, "en").name, "Jepang");
  assert.equal(resolveCountry(country, "id").name, "Jepang");
  assert.equal(
    resolveCountry({ ...country, translations: [] }, "en").name,
    "Legacy Jepang",
  );
});

test("program resolution applies fallback independently for scalar and nested text", () => {
  const program = {
    id: "program-1",
    title: "Legacy title",
    shortDescription: "Legacy short",
    description: "Legacy description",
    objectives: [
      {
        _key: "objective-1",
        sticker: "🎯",
        title: "Legacy objective",
        description: "Legacy objective description",
      },
    ],
    timeline: [],
    scholarships: [],
    customSections: [],
    gallery: [],
    country: {
      id: "country-1",
      name: "Jepang",
      translations: [
        { locale: "id", name: "Jepang" },
        { locale: "en", name: "Japan" },
      ],
    },
    translations: [
      {
        locale: "id",
        title: "Judul Indonesia",
        shortDescription: "Ringkasan Indonesia",
        description: "Deskripsi Indonesia",
        objectives: [
          {
            _key: "objective-1",
            title: "Tujuan Indonesia",
            description: "Deskripsi tujuan Indonesia",
          },
        ],
      },
      {
        locale: "en",
        title: "English title",
        shortDescription: null,
        description: "",
        objectives: [
          {
            _key: "objective-1",
            title: "English objective",
            description: null,
          },
        ],
      },
    ],
  };

  const result = resolveProgram(program, "en");
  assert.equal(result.title, "English title");
  assert.equal(result.shortDescription, "Ringkasan Indonesia");
  assert.equal(result.description, "Deskripsi Indonesia");
  assert.equal(result.objectives[0].title, "English objective");
  assert.equal(
    result.objectives[0].description,
    "Deskripsi tujuan Indonesia",
  );
  assert.equal(result.objectives[0].sticker, "🎯");
  assert.equal(result.country.name, "Japan");
});
