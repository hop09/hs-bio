import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import {
  extensionMimeTypes,
  resolveStoredMedia,
} from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const target = resolveStoredMedia((await params).path);
  if (!target) return new Response("Not found", { status: 404 });

  let details;
  try {
    details = await stat(target);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!details.isFile()) return new Response("Not found", { status: 404 });

  const contentType =
    extensionMimeTypes.get(path.extname(target).toLowerCase()) ||
    "application/octet-stream";
  const range = request.headers.get("range");
  const commonHeaders = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
  };

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${details.size}` },
      });
    }
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2]
      ? Math.min(Number(match[2]), details.size - 1)
      : details.size - 1;
    if (start > end || start >= details.size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${details.size}` },
      });
    }
    const stream = createReadStream(target, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...commonHeaders,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${details.size}`,
      },
    });
  }

  const stream = createReadStream(target);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: { ...commonHeaders, "Content-Length": String(details.size) },
  });
}
