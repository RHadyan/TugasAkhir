import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import imageKit from "@/configs/imageKit";
import { serializeCountryTranslations } from "@/lib/content-i18n";

// GET /api/admin/countries - Get all countries (No Cache)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
              },
            },
            {
              translations: {
                some: {
                  name: {
                    contains: search,
                  },
                },
              },
            },
          ],
        }
      : {};

    // Get countries from database directly
    const [countries, total] = await Promise.all([
      prisma.country.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: "asc",
        },
        include: {
          translations: true,
          _count: {
            select: { programs: true },
          },
        },
      }),
      prisma.country.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: countries.map((country) => ({
          ...country,
          translations: serializeCountryTranslations(country),
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
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch countries",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/countries - Create a new country
export async function POST(request: NextRequest) {
  try {
    // Get data from FormData
    const formData = await request.formData();
    const name =
      (formData.get("nameId") as string | null)?.trim() ||
      (formData.get("name") as string | null)?.trim() ||
      "";
    const englishName =
      (formData.get("nameEn") as string | null)?.trim() || null;
    const flagImageFile = formData.get("flagImage") as File | null;

    // Validation
    if (!name || !flagImageFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and flagImage are required",
        },
        { status: 400 }
      );
    }

    // Check if country already exists
    const existingCountry = await prisma.country.findUnique({
      where: { name },
    });

    if (existingCountry) {
      return NextResponse.json(
        {
          success: false,
          error: "Country with this name already exists",
        },
        { status: 409 }
      );
    }

    // Upload flag image to ImageKit
    const buffer = Buffer.from(await flagImageFile.arrayBuffer());

    const uploadResponse = await imageKit.upload({
      file: buffer,
      fileName: flagImageFile.name,
      folder: "countries/flags",
    });

    const flagImageUrl = imageKit.url({
      path: uploadResponse.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { height: "1024" },
      ],
    });

    // Create country
    const country = await prisma.country.create({
      data: {
        name,
        flagImage: flagImageUrl,
        translations: {
          create: [
            { locale: "id", name },
            { locale: "en", name: englishName },
          ],
        },
      },
      include: { translations: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...country,
          translations: serializeCountryTranslations(country),
        },
        message: "Country created successfully",
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
    console.error("Error creating country:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create country",
      },
      { status: 500 }
    );
  }
}
