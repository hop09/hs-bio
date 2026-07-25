import "server-only";

import path from "node:path";

export const imageMimeTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

export const videoMimeTypes = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/ogg", ".ogv"],
  ["video/quicktime", ".mov"],
]);

export const extensionMimeTypes = new Map(
  [...imageMimeTypes, ...videoMimeTypes].map(([mime, extension]) => [
    extension,
    mime,
  ]),
);

export function uploadRoot() {
  const configured = process.env.UPLOAD_DIR || "storage/uploads";
  return path.isAbsolute(configured)
    ? path.normalize(configured)
    : path.join(/*turbopackIgnore: true*/ process.cwd(), configured);
}

export function maxUploadBytes() {
  const configured = Number(process.env.MAX_UPLOAD_MB || 200);
  const megabytes =
    Number.isFinite(configured) && configured > 0 ? configured : 200;
  return megabytes * 1024 * 1024;
}

export function resolveStoredMedia(parts: string[]) {
  if (
    parts.length !== 2 ||
    !["images", "videos"].includes(parts[0]) ||
    !/^[a-f0-9-]+\.[a-z0-9]+$/i.test(parts[1])
  ) {
    return null;
  }
  const root = uploadRoot();
  const target = path.resolve(root, parts[0], parts[1]);
  if (!target.startsWith(`${root}${path.sep}`)) return null;
  return target;
}
