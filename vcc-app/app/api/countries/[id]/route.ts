import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import imageKit from "@/configs/imageKit";
import { parseLocale, resolveCountry, resolveProgram } from "@/lib/content-i18n";

// GET /api/countries/[id] - Get a single country by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locale = parseLocale(new URL(request.url).searchParams.get("locale"));

    if (!locale) {
      return NextResponse.json(
        { success: false, error: "locale must be either id or en" },
        { status: 400 },
      );
    }

    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        translations: true,
        programs: {
          where: { isPublished: true },
          include: { translations: true },
        },
      },
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

    return NextResponse.json(
      {
        success: true,
        data: {
          ...resolveCountry(country, locale),
          programs: country.programs.map((program) =>
            resolveProgram(program, locale),
          ),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching country:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch country",
      },
      { status: 500 }
    );
  }
}

// PUT /api/countries/[id] - Update a country
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get data from FormData
    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const flagImageFile = formData.get("flagImage") as File | null;

    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      return NextResponse.json(
        {
          success: false,
          error: "Country not found",
        },
        { status: 404 }
      );
    }

    // If name is being changed, check if new name already exists
    if (name && name !== existingCountry.name) {
      const duplicateCountry = await prisma.country.findUnique({
        where: { name },
      });

      if (duplicateCountry) {
        return NextResponse.json(
          {
            success: false,
            error: "Country with this name already exists",
          },
          { status: 409 }
        );
      }
    }

    // Upload new flag image if provided
    let flagImageUrl: string | undefined;
    if (flagImageFile) {
      const buffer = Buffer.from(await flagImageFile.arrayBuffer());

      const uploadResponse = await imageKit.upload({
        file: buffer,
        fileName: flagImageFile.name,
        folder: "countries/flags",
      });

      flagImageUrl = imageKit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { height: "1024" }
        ]
      });
    }

    // Update country
    const country = await prisma.country.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(flagImageUrl && { flagImage: flagImageUrl }),
        ...(name && {
          translations: {
            upsert: {
              where: {
                countryId_locale: { countryId: id, locale: "id" },
              },
              create: { locale: "id", name },
              update: { name },
            },
          },
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: country,
        message: "Country updated successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error updating country:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update country",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/countries/[id] - Delete a country
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if country exists
    const existingCountry = await prisma.country.findUnique({
      where: { id },
      include: {
        _count: {
          select: { programs: true },
        },
      },
    });

    if (!existingCountry) {
      return NextResponse.json(
        {
          success: false,
          error: "Country not found",
        },
        { status: 404 }
      );
    }

    // Check if country has programs
    if (existingCountry._count.programs > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete country with ${existingCountry._count.programs} associated program(s)`,
        },
        { status: 409 }
      );
    }

    // Delete country
    await prisma.country.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Country deleted successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete country",
      },
      { status: 500 }
    );
  }
}
