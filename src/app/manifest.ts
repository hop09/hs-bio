import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HS Bio",
    short_name: "HS Bio",
    description: "One link, entirely yours.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f3ef",
    theme_color: "#171713",
    icons: [
      {
        src: "/brand-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
