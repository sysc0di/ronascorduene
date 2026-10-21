/**
 * Media helpers for the storefront.
 *
 * A product gallery holds images and videos mixed, and the only thing that
 * tells them apart is the file extension of the stored URL.
 */

const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogv",
  "ogg",
] as const;

/** True when the URL points at a video the browser can play. */
export function isVideoUrl(url: string): boolean {
  const path = url.split(/[?#]/)[0].toLowerCase();

  return (VIDEO_EXTENSIONS as readonly string[]).some((extension) =>
    path.endsWith(`.${extension}`),
  );
}
