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
- Protected profile dashboard with publishing, verification, theme, media, and
  advanced structured-content controls

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
`links`, `gallery`, `posts`, `blogs`, `videos`, `ad`, and `text`. Moving an
object in this array changes its public placement, including advertisement
positions. Ad code is trusted-admin content and is never accepted from public
visitors.
