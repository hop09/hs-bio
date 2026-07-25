# HS Bio

A production-oriented, single-admin platform for creating and managing multiple
dynamic bio pages.

## Current capabilities

- MongoDB-backed profiles with automatic sample data for `/hamza` and `/sheza`
- Secure, HTTP-only single-admin sessions with hashed password storage
- Dynamic profile and separate blog routes with per-page metadata
- Ten structural profile themes with light and dark mode support
- Ordered links, galleries, notes, blogs, videos, advertisements, and text blocks
- First-click external video redirect followed by a configurable timed unlock
- Protected no-code profile dashboard with publishing, verification, theme,
  media previews, social profiles, SEO, and visual ordered-section controls

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
3. Add your MongoDB Atlas connection string and private credentials to
   `.env.local`. Never commit that file.
4. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

The production server requires Node.js 20.9 or newer. After deployment,
`/api/health` reports whether both the application and MongoDB connection are
available.

For Hostinger manual build settings use:

- Framework: `Next.js` (or `Other` if automatic detection fails)
- Build command: `npm run build`
- Output directory: `.next`
- Start command: `npm start`
- Entry file when requested: `server.mjs`
- Listening port: Hostinger-provided `PORT` (the server binds automatically)

## Environment variables

- `MONGODB_URI`: MongoDB Atlas driver connection string.
- `MONGODB_DB`: Database name; the default is `hsbio`.
- `AUTH_SECRET`: A long random value used to sign authentication sessions.
- `ADMIN_EMAIL`: Initial single-admin email address.
- `ADMIN_PASSWORD`: Initial admin password. It will be stored as a secure hash
  when authentication is implemented.
- `NEXT_PUBLIC_APP_URL`: Canonical public application URL.

The implementation will keep database access and media providers behind modular
services so the application remains deployable locally or on Vercel.

## Content model

Each profile stores an ordered `blocks` array. Supported block types are
`links`, `gallery`, `posts`, `blogs`, `videos`, `projects`, `ad`, and `text`.
Moving an object in this array changes its public placement, including
advertisement positions. Projects support unlimited slider images, a chosen
default card image, a caption, and a detailed description. Ad code is
trusted-admin content and is never accepted from public visitors.

The admin builder exposes this model through regular forms: sections and nested
items can be added, edited, reordered, or removed without writing JSON.

## Hostinger media storage

The protected admin uploader supports JPG, PNG, WebP, GIF, AVIF, MP4, WebM,
OGV, and MOV files. Uploaded filenames are randomized and media is delivered
through `/media/*`; video responses support HTTP byte ranges for seeking.
Every image field also includes a pencil action for crop, zoom, aspect-ratio
selection, and re-uploading the optimized WebP result.

For Hostinger production, create a persistent writable directory outside
temporary build output where possible, then configure:

```env
UPLOAD_DIR=/absolute/path/to/persistent/hsbio-uploads
MAX_UPLOAD_MB=200
```

The Node.js application user must have read/write permission for this
directory. Also set Hostinger's reverse-proxy request-body limit at or above
`MAX_UPLOAD_MB`; otherwise the proxy can reject large videos before Next.js
receives them. Keep the uploads directory in hosting backups because MongoDB
stores media URLs, not the binary files.
