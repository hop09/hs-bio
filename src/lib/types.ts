export const themeIds = [
  "minimal",
  "glass",
  "editorial",
  "neon",
  "luxury",
  "creator",
  "professional",
  "gradient",
  "retro",
  "portfolio",
] as const;

export type ThemeId = (typeof themeIds)[number];

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "linkedin"
  | "github"
  | "twitter"
  | "facebook"
  | "website"
  | "mail";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface LinkBlock {
  id: string;
  type: "links";
  title?: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
    url: string;
    icon?: string;
    featured?: boolean;
  }>;
}

export interface GalleryBlock {
  id: string;
  type: "gallery";
  title?: string;
  layout?: "grid" | "masonry" | "featured";
  items: Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
    url?: string;
  }>;
}

export interface PostsBlock {
  id: string;
  type: "posts";
  title?: string;
  items: Array<{
    id: string;
    content: string;
    publishedAt: string;
    image?: string;
  }>;
}

export interface BlogBlock {
  id: string;
  type: "blogs";
  title?: string;
  items: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    authorName: string;
    content: string;
  }>;
}

export interface VideoBlock {
  id: string;
  type: "videos";
  title?: string;
  items: Array<{
    id: string;
    provider: "youtube" | "vimeo" | "mp4" | "embed";
    source: string;
    title: string;
    description?: string;
    thumbnail?: string;
    externalUrl?: string;
    redirectDelaySeconds?: number;
    ctaLabel?: string;
    ctaUrl?: string;
  }>;
}

export interface AdBlock {
  id: string;
  type: "ad";
  title?: string;
  format: "html" | "iframe" | "image" | "script";
  code?: string;
  imageUrl?: string;
  destinationUrl?: string;
  enabled: boolean;
}

export interface TextBlock {
  id: string;
  type: "text";
  title?: string;
  content: string;
}

export interface ProjectsBlock {
  id: string;
  type: "projects";
  title?: string;
  items: Array<{
    id: string;
    title: string;
    caption: string;
    description: string;
    defaultImageId?: string;
    images: Array<{
      id: string;
      src: string;
      alt: string;
    }>;
  }>;
}

export type ContentBlock =
  | LinkBlock
  | GalleryBlock
  | PostsBlock
  | BlogBlock
  | VideoBlock
  | AdBlock
  | TextBlock
  | ProjectsBlock;

export interface BioProfile {
  _id?: string;
  slug: string;
  name: string;
  username: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  verified: boolean;
  theme: ThemeId;
  published: boolean;
  socialLinks: SocialLink[];
  blocks: ContentBlock[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
