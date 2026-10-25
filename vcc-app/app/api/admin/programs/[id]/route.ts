import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import imageKit from "@/configs/imageKit";
import {
  buildLegacyTranslation,
  ensureProgramStructure,
  indonesianTranslationData,
  parseTranslations,
  serializeTranslations,
  translationData,
} from "@/lib/content-i18n";

const normalizeGalleryItems = (galleryItems: any[] | undefined) => {
  if (!Array.isArray(galleryItems)) return [];

  return galleryItems.map((item: any) => {
    if (!item || typeof item !== "object") {
      return { imageUrl: "", title: "", shortDescription: "" };
    }

    return {
      ...item,
      title: item.title ?? "",
      shortDescription: item.shortDescription ?? "",
    };
  });
};

const nestedFile = (
  formData: FormData,
  stablePrefix: string,
  legacyKey: string,
  item: any,
) =>
  (item?._key
    ? (formData.get(`${stablePrefix}_${item._key}`) as File | null)
    : null) || (formData.get(legacyKey) as File | null);

// GET /api/admin/programs/[id] - Get a single program by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        translations: true,
        country: {
          include: { translations: true },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          error: "Program not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...program,
          translations: serializeTranslations(program),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch program",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/programs/[id] - Update a program
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get data from FormData
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const shortDescription = formData.get("shortDescription") as string | null;
    const description = formData.get("description") as string | null;
    const countryId = formData.get("countryId") as string | null;
    const isPublishedStr = formData.get("isPublished") as string | null;
    const timelineDescription = formData.get("timelineDescription") as string | null;
    const scholarshipDescription = formData.get("scholarshipDescription") as string | null;
    const mainColor = formData.get("mainColor") as string | null;
    const translationsEntry = formData.get("translations");
    let translations: ReturnType<typeof parseTranslations>;
    try {
      translations = parseTranslations(translationsEntry);
    } catch {
      return NextResponse.json(
        { success: false, error: "translations must be valid JSON" },
        { status: 400 },
      );
    }

    console.log("DEBUG ADMIN PUT: mainColor", mainColor);

    // Parse JSON fields
    const parseJson = (key: string) => {
      const value = formData.get(key) as string | null;
      if (!value) return undefined;
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return undefined;
      }
    };

    const eligibleStudyPrograms = parseJson("eligibleStudyPrograms");
    const objectivesRaw = parseJson("objectives");
    const objectives =
      objectivesRaw === undefined
        ? undefined
        : ensureProgramStructure(objectivesRaw, "objective");
    const timelineRaw = parseJson("timeline");
    const timeline =
      timelineRaw === undefined
        ? undefined
        : ensureProgramStructure(timelineRaw, "timeline");
    const scholarshipsRaw = parseJson("scholarships");
    const scholarships =
      scholarshipsRaw === undefined
        ? undefined
        : ensureProgramStructure(scholarshipsRaw, "scholarship");
    const contactPersons = parseJson("contactPersons");
    const galleryRaw = parseJson("gallery");
    const gallery =
      galleryRaw === undefined
        ? undefined
        : ensureProgramStructure(
            normalizeGalleryItems(galleryRaw),
            "gallery",
          );
    const customSectionsRaw = parseJson("customSections");
    const customSections =
      customSectionsRaw === undefined
        ? undefined
        : ensureProgramStructure(customSectionsRaw, "custom-section");
    const socialMedia = parseJson("socialMedia");

    // Get image files for gallery
    const galleryImageFiles = formData.getAll("galleryImages") as File[];

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        {
          success: false,
          error: "Program not found",
        },
        { status: 404 }
      );
    }

    // If countryId is being changed, check if new country exists
    if (countryId && countryId !== existingProgram.countryId) {
      const country = await prisma.country.findUnique({
        where: { id: countryId },
      });

      if (!country) {
        return NextResponse.json(
          {
            success: false,
            error: "Country not found",
          },
          { status: 404 }
        );
      }
    }

    // Upload new thumbnail if provided
    let thumbnailUrl: string | undefined;
    if (thumbnailFile) {
      const buffer = Buffer.from(await thumbnailFile.arrayBuffer());
      const uploadResponse = await imageKit.upload({
        file: buffer,
        fileName: thumbnailFile.name,
        folder: "programs/thumbnails",
      });

      thumbnailUrl = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { height: "1024" }
        ]
      });
    }

    // Process Timeline Images
    if (timeline && timeline.length > 0) {
      await Promise.all(
        timeline.map(async (item: any, index: number) => {
          const file = nestedFile(
            formData,
            "timeline_image",
            `timeline_image_${index}`,
            item,
          );
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const upload = await imageKit.upload({
              file: buffer,
              fileName: file.name,
              folder: "programs/timeline",
            });
            const url = imageKit.url({
              path: upload.filePath,
              transformation: [{ quality: "auto" }, { format: "webp" }]
            });
            item.image = url;
          }
        })
      );
    }

    // Process Scholarship Images
    if (scholarships && scholarships.length > 0) {
      await Promise.all(
        scholarships.map(async (item: any, index: number) => {
          const file = nestedFile(
            formData,
            "scholarship_image",
            `scholarship_image_${index}`,
            item,
          );
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const upload = await imageKit.upload({
              file: buffer,
              fileName: file.name,
              folder: "programs/scholarships",
            });
            const url = imageKit.url({
              path: upload.filePath,
              transformation: [{ quality: "auto" }, { format: "webp" }]
            });
            item.image = url;
          }
        })
      );
    }

    // Process Custom Sections Images
    if (customSections && customSections.length > 0) {
      await Promise.all(
        customSections.map(async (section: any, sectionIndex: number) => {
          if (section.cards && section.cards.length > 0) {
            await Promise.all(
              section.cards.map(async (card: any, cardIndex: number) => {
                const file = nestedFile(
                  formData,
                  "custom_card_image",
                  `custom_section_${sectionIndex}_card_${cardIndex}_image`,
                  card,
                );
                if (file) {
                  const buffer = Buffer.from(await file.arrayBuffer());
                  const upload = await imageKit.upload({
                    file: buffer,
                    fileName: file.name,
                    folder: "programs/custom_sections",
                  });
                  const url = imageKit.url({
                    path: upload.filePath,
                    transformation: [{ quality: "auto" }, { format: "webp" }]
                  });
                  card.image = url;
                }
              })
            );
          }
        })
      );
    }

    // Process Gallery Images (Indexed)
    if (gallery && gallery.length > 0) {
      await Promise.all(
        gallery.map(async (item: any, index: number) => {
          const file = nestedFile(
            formData,
            "gallery_image",
            `gallery_image_${index}`,
            item,
          );
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const upload = await imageKit.upload({
              file: buffer,
              fileName: file.name,
              folder: "programs/gallery",
            });
            const url = imageKit.url({
              path: upload.filePath,
              transformation: [
                { quality: "auto" },
                { format: "webp" },
                { height: "1024" }
              ]
            });
            item.imageUrl = url;
          }
        })
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== null) updateData.title = title;
    if (thumbnailUrl !== undefined) updateData.thumbnail = thumbnailUrl;
    if (shortDescription !== null) updateData.shortDescription = shortDescription;
    if (description !== null) updateData.description = description;
    if (countryId !== null) updateData.countryId = countryId;
    if (timelineDescription !== null) updateData.timelineDescription = timelineDescription;
    if (scholarshipDescription !== null) updateData.scholarshipDescription = scholarshipDescription;
    if (mainColor !== null) updateData.mainColor = mainColor;

    if (eligibleStudyPrograms !== undefined) updateData.eligibleStudyPrograms = eligibleStudyPrograms;
    if (objectives !== undefined) updateData.objectives = objectives;
    if (timeline !== undefined) updateData.timeline = timeline;
    if (scholarships !== undefined) updateData.scholarships = scholarships;
    if (contactPersons !== undefined) updateData.contactPersons = contactPersons;
    if (customSections !== undefined) updateData.customSections = customSections;
    if (gallery !== undefined) updateData.gallery = gallery;
    if (socialMedia !== undefined) updateData.socialMedia = socialMedia;

    // Handle publish/unpublish
    if (isPublishedStr !== null) {
      const isPublished = isPublishedStr === "true";
      updateData.isPublished = isPublished;
      if (isPublished && !existingProgram.publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!isPublished) {
        updateData.publishedAt = null;
      }
    }

    const legacyTranslation = buildLegacyTranslation({
      title: updateData.title ?? existingProgram.title,
      shortDescription:
        updateData.shortDescription ?? existingProgram.shortDescription,
      description: updateData.description ?? existingProgram.description,
      timelineDescription:
        updateData.timelineDescription ??
        existingProgram.timelineDescription,
      scholarshipDescription:
        updateData.scholarshipDescription ??
        existingProgram.scholarshipDescription,
      objectives: updateData.objectives ?? (existingProgram.objectives as any[]),
      timeline: updateData.timeline ?? (existingProgram.timeline as any[]),
      scholarships:
        updateData.scholarships ?? (existingProgram.scholarships as any[]),
      customSections:
        updateData.customSections ??
        (existingProgram.customSections as any[]),
      gallery: updateData.gallery ?? (existingProgram.gallery as any[]),
    });
    const indonesian = indonesianTranslationData(
      translations,
      legacyTranslation,
    );
    updateData.translations = {
      upsert: [
        {
          where: { programId_locale: { programId: id, locale: "id" } },
          create: indonesian,
          update: {
            title: indonesian.title,
            shortDescription: indonesian.shortDescription,
            description: indonesian.description,
            timelineDescription: indonesian.timelineDescription,
            scholarshipDescription: indonesian.scholarshipDescription,
            objectives: indonesian.objectives,
            timeline: indonesian.timeline,
            scholarships: indonesian.scholarships,
            customSections: indonesian.customSections,
            gallery: indonesian.gallery,
          },
        },
        ...(translationsEntry !== null
          ? [
              {
                where: {
                  programId_locale: { programId: id, locale: "en" as const },
                },
                create: {
                  locale: "en" as const,
                  ...translationData(translations.en ?? {}),
                },
                update: translationData(translations.en ?? {}),
              },
            ]
          : []),
      ],
    };

    // Update program
    const program = await prisma.program.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        country: {
          include: { translations: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...program,
        translations: serializeTranslations(program),
      },
      message: "Program updated successfully",
    },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        }
      });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update program",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/programs/[id] - Delete a program
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id },
    });

    if (!existingProgram) {
      return NextResponse.json(
        {
          success: false,
          error: "Program not found",
        },
        { status: 404 }
      );
    }

    // Delete program
    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        }
      });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete program",
      },
      { status: 500 }
    );
  }
}
