import type { BioProfile } from "@/lib/types";

export const sampleProfiles: BioProfile[] = [
  {
    slug: "hamza",
    name: "Hamza Shah",
    username: "@hamzashah",
    bio: "Product designer, visual storyteller, and curious builder creating thoughtful digital experiences.",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=90",
    coverImage:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=90",
    verified: true,
    theme: "editorial",
    published: true,
    socialLinks: [
      { id: "s1", platform: "instagram", label: "Instagram", url: "https://instagram.com" },
      { id: "s2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
      { id: "s3", platform: "website", label: "Portfolio", url: "https://example.com" },
    ],
    blocks: [
      {
        id: "hamza-links",
        type: "links",
        title: "Selected destinations",
        items: [
          { id: "l1", label: "Explore my latest project", description: "A calmer way to plan creative work", url: "https://example.com", featured: true },
          { id: "l2", label: "Read my design notes", description: "Process, craft, and quiet observations", url: "https://example.com" },
        ],
      },
      {
        id: "hamza-gallery",
        type: "gallery",
        title: "Recent frames",
        layout: "featured",
        items: [
          { id: "g1", src: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1200&q=85", alt: "Design sketches on a desk", caption: "Work in progress", url: "https://example.com" },
          { id: "g2", src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85", alt: "Modern creative studio", caption: "The studio" },
          { id: "g3", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85", alt: "Minimal workspace", caption: "Daily rituals" },
        ],
      },
      {
        id: "hamza-posts",
        type: "posts",
        title: "Notes",
        items: [
          { id: "p1", content: "Good design often begins by removing the thing everyone assumed had to be there.", publishedAt: "2026-07-18" },
          { id: "p2", content: "Currently exploring how editorial rhythm can make product interfaces feel more human.", publishedAt: "2026-07-09" },
        ],
      },
      {
        id: "hamza-ad",
        type: "ad",
        format: "image",
        title: "Partner",
        enabled: true,
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",
        destinationUrl: "https://example.com",
      },
      {
        id: "hamza-blogs",
        type: "blogs",
        title: "Long-form",
        items: [
          {
            id: "b1",
            slug: "designing-with-restraint",
            title: "Designing with restraint",
            excerpt: "Why the strongest interface decision is often the quietest one.",
            coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=85",
            publishedAt: "2026-07-12",
            authorName: "Hamza Shah",
            content: "Restraint is not the absence of ideas. It is the discipline to identify which idea deserves the room. In digital products, every element asks for attention, but attention is finite.\n\nThe best interfaces establish a clear hierarchy, let typography do real work, and use motion only when it explains a change. They feel obvious after the fact because their complexity has been resolved rather than displayed.\n\nThis approach requires confidence. It means testing the quieter option, editing without mercy, and trusting the audience enough to leave space for them.",
          },
        ],
      },
      {
        id: "hamza-videos",
        type: "videos",
        title: "Watch",
        items: [
          {
            id: "v1",
            provider: "youtube",
            source: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
            title: "A short visual experiment",
            description: "Redirects once, then unlocks playback for 12 seconds.",
            thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=85",
            externalUrl: "https://example.com",
            redirectDelaySeconds: 12,
          },
        ],
      },
    ],
  },
  {
    slug: "sheza",
    name: "Sheza Noor",
    username: "@shezan",
    bio: "Photographer and creative director documenting color, culture, and everyday wonder.",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=90",
    coverImage:
      "https://images.unsplash.com/photo-1518568740560-333139a27e72?auto=format&fit=crop&w=1800&q=90",
    verified: true,
    theme: "gradient",
    published: true,
    socialLinks: [
      { id: "ss1", platform: "instagram", label: "Instagram", url: "https://instagram.com" },
      { id: "ss2", platform: "youtube", label: "YouTube", url: "https://youtube.com" },
      { id: "ss3", platform: "mail", label: "Email", url: "mailto:hello@example.com" },
    ],
    blocks: [
      {
        id: "sheza-links",
        type: "links",
        title: "Come along",
        items: [
          { id: "sl1", label: "The summer print shop", description: "Limited photographic editions", url: "https://example.com", featured: true },
          { id: "sl2", label: "Book a creative session", url: "https://example.com" },
        ],
      },
      {
        id: "sheza-gallery",
        type: "gallery",
        title: "Color studies",
        layout: "masonry",
        items: [
          { id: "sg1", src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85", alt: "Lush tropical leaves", url: "https://example.com" },
          { id: "sg2", src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85", alt: "Colorful landscape" },
          { id: "sg3", src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=85", alt: "Colorful celebration" },
          { id: "sg4", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85", alt: "Traveler in a landscape" },
        ],
      },
      {
        id: "sheza-blogs",
        type: "blogs",
        title: "Field journal",
        items: [
          {
            id: "sb1",
            slug: "finding-color-everywhere",
            title: "Finding color everywhere",
            excerpt: "A field note on training the eye to notice what is already present.",
            coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=85",
            publishedAt: "2026-07-03",
            authorName: "Sheza Noor",
            content: "Color rarely announces itself in the way we expect. It appears in reflected light, in a weathered wall, or in the small contrast between an ordinary object and its surroundings.\n\nPhotography has taught me that noticing is a practice. Slow down, revisit familiar streets, and let changing light remake the scene.\n\nThe camera comes later. First comes attention.",
          },
        ],
      },
    ],
  },
];
