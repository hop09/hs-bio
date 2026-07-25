import type { BioProfile } from "@/lib/types";
import { ProfileHeader } from "@/components/profile-header";
import { ContentSections } from "@/components/content-sections";
import { BrandLogo } from "@/components/brand-logo";

export function BioPage({ profile }: { profile: BioProfile }) {
  return (
    <main className={`bio-page theme-${profile.theme}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="bio-shell"><ProfileHeader profile={profile} /><ContentSections profile={profile} /><footer className="bio-footer"><BrandLogo compact /> Crafted with intention</footer></div>
    </main>
  );
}
