import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;

  let imageUrl: string | null | undefined;

  try {
    if (type === "post") {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id, 10) },
        select: { imageUrl: true },
      });
      imageUrl = post?.imageUrl;
    } else if (type === "service") {
      const service = await prisma.service.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
      imageUrl = service?.imageUrl;
    } else if (type === "about") {
      const about = await prisma.aboutInfo.findFirst({
        where: { id: "singleton" },
        select: { imageUrl: true },
      });
      imageUrl = about?.imageUrl;
    }

    if (!imageUrl) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (imageUrl.startsWith("data:image")) {
      const matches = imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return NextResponse.redirect(new URL(imageUrl, request.url));
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
