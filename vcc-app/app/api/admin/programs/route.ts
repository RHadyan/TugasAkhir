import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import imageKit from "@/configs/imageKit";
import {
  buildLegacyTranslation,
  ensureProgramStructure,
  parseTranslations,
  serializeTranslations,
  translationCreateData,
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

// GET /api/admin/programs - Get all programs (No Cache)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const countryId = searchParams.get("countryId") || "";
    const isPublished = searchParams.get("isPublished");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          shortDescription: {
            contains: search,
          },
        },
      ];
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === "true";
    }

    // Get programs with pagination
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          translations: true,
          country: {
            include: { translations: true },
          },
        },
      }),
      prisma.program.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: programs.map((program) => ({
          ...program,
          translations: serializeTranslations(program),
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
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
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch programs",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/programs - Create a new program
export async function POST(request: NextRequest) {
  try {
    // Get data from FormData
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const thumbnailFile = formData.get("thumbnail") as File | null;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string;
    const countryId = formData.get("countryId") as string;
    const isPublished = formData.get("isPublished") === "true";
    const timelineDescription = formData.get("timelineDescription") as string;
    const scholarshipDescription = formData.get("scholarshipDescription") as string;
    const mainColor = formData.get("mainColor") as string || "#000000";
    const galleryImageFiles = formData.getAll("galleryImages") as File[];
    let translations: ReturnType<typeof parseTranslations>;
    try {
      translations = parseTranslations(formData.get("translations"));
    } catch {
      return NextResponse.json(
        { success: false, error: "translations must be valid JSON" },
        { status: 400 },
      );
    }

    console.log("DEBUG ADMIN POST: mainColor", mainColor);

    // Validation
    if (!title || !thumbnailFile || !shortDescription || !description || !countryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, thumbnail, shortDescription, description, and countryId are required",
        },
        { status: 400 }
      );
    }

    // Check if country exists
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

    // Parse JSON fields
    const parseJson = (key: string, defaultValue: any) => {
      const value = formData.get(key) as string | null;
      if (!value) return defaultValue;
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(`Error parsing ${key}:`, e);
        return defaultValue;
      }
    };

    const eligibleStudyPrograms = parseJson("eligibleStudyPrograms", []);
    const objectives = ensureProgramStructure(
      parseJson("objectives", []),
      "objective",
    );
    const timeline = ensureProgramStructure(
      parseJson("timeline", []),
      "timeline",
    );
    const scholarships = ensureProgramStructure(
      parseJson("scholarships", []),
      "scholarship",
    );
    const contactPersons = parseJson("contactPersons", []);
    const customSections = ensureProgramStructure(
      parseJson("customSections", []),
      "custom-section",
    );
    const gallery = ensureProgramStructure(
      normalizeGalleryItems(parseJson("gallery", [])),
      "gallery",
    );

    // Upload thumbnail
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const thumbnailUpload = await imageKit.upload({
      file: thumbnailBuffer,
      fileName: thumbnailFile.name,
      folder: "programs/thumbnails",
    });

    const thumbnailUrl = imageKit.url({
      path: thumbnailUpload.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { height: "1024" }
      ]
    });

    // Process Timeline Images
    if (timeline.length > 0) {
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
    if (scholarships.length > 0) {
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
    if (customSections.length > 0) {
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

    if (gallery.length > 0 && galleryImageFiles.length > 0) {
      const galleryImageUrls = await Promise.all(
        galleryImageFiles.map(async (imageFile) => {
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          const uploadResponse = await imageKit.upload({
            file: buffer,
            fileName: imageFile.name,
            folder: "programs/gallery",
          });

          return imageKit.url({
            path: uploadResponse.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { height: "1024" }
            ]
          });
        })
      );

      gallery.forEach((item: any, index: number) => {
        if (galleryImageUrls[index]) {
          item.imageUrl = galleryImageUrls[index];
        }
      });
    }

    // Create program
    const program = await prisma.program.create({
      data: {
        title,
        thumbnail: thumbnailUrl,
        shortDescription,
        description,
        countryId,
        eligibleStudyPrograms,
        objectives,
        timelineDescription,
        timeline,
        scholarshipDescription,
        scholarships,
        contactPersons,
        customSections,
        gallery,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        mainColor,
        translations: {
          create: translationCreateData(
            translations,
            buildLegacyTranslation({
              title,
              shortDescription,
              description,
              timelineDescription,
              scholarshipDescription,
              objectives,
              timeline,
              scholarships,
              customSections,
              gallery,
            }),
          ),
        },
      },
      include: {
        translations: true,
        country: {
          include: { translations: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...program,
          translations: serializeTranslations(program),
        },
        message: "Program created successfully",
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create program",
      },
      { status: 500 }
    );
  }
}
