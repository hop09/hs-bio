import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  imageMimeTypes,
  maxUploadBytes,
  uploadRoot,
  videoMimeTypes,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const requestedKind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > maxUploadBytes()) {
    return NextResponse.json(
      { error: `File must be smaller than ${Math.floor(maxUploadBytes() / 1024 / 1024)} MB.` },
      { status: 413 },
    );
  }

  const detectedKind = imageMimeTypes.has(file.type)
    ? "images"
    : videoMimeTypes.has(file.type)
      ? "videos"
      : null;
  const expectedKind = requestedKind === "video" ? "videos" : "images";
  if (!detectedKind || detectedKind !== expectedKind) {
    return NextResponse.json(
      { error: expectedKind === "images" ? "Upload a JPG, PNG, WebP, GIF, or AVIF image." : "Upload an MP4, WebM, OGV, or MOV video." },
      { status: 415 },
    );
  }

  const extension =
    (detectedKind === "images" ? imageMimeTypes : videoMimeTypes).get(file.type) || "";
  const filename = `${randomUUID()}${extension}`;
  const directory = path.join(uploadRoot(), detectedKind);
  const target = path.join(directory, filename);

  await mkdir(directory, { recursive: true });
  try {
    await pipeline(
      Readable.fromWeb(file.stream() as never),
      createWriteStream(target, { flags: "wx" }),
    );
  } catch {
    await unlink(target).catch(() => undefined);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    url: `/media/${detectedKind}/${filename}`,
    name: file.name,
    size: file.size,
    type: file.type,
  });
}
