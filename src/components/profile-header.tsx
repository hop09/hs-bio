import Image from "next/image";
import { BriefcaseBusiness, Camera, Code2, Globe2, Mail, MessageCircle, PlaySquare, Users } from "lucide-react";
import type { BioProfile, SocialPlatform } from "@/lib/types";
import { VerifiedBadge } from "@/components/verified-badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { safeExternalUrl } from "@/lib/utils";

const icons = { instagram: Camera, youtube: PlaySquare, linkedin: BriefcaseBusiness, github: Code2, twitter: MessageCircle, facebook: Users, website: Globe2, mail: Mail } satisfies Record<SocialPlatform, typeof Globe2>;

export function ProfileHeader({ profile }: { profile: BioProfile }) {
  return (
    <header className="profile-header">
      <div className="profile-cover">
        <Image src={profile.coverImage} alt={`${profile.name} cover`} fill priority sizes="(max-width: 900px) 100vw, 900px" />
        <div className="cover-shade" />
        <div className="header-actions"><ThemeSwitcher compact /></div>
      </div>
      <div className="profile-identity">
        <div className="avatar-wrap">
          <Image src={profile.profileImage} alt={profile.name} fill priority sizes="144px" />
        </div>
        <div className="identity-copy">
          <div className="name-row"><h1>{profile.name}</h1>{profile.verified && <VerifiedBadge />}</div>
          <p className="username">{profile.username}</p>
          <p className="bio">{profile.bio}</p>
          <nav className="social-row" aria-label={`${profile.name} social profiles`}>
            {profile.socialLinks.map((link) => {
              const Icon = icons[link.platform] ?? Globe2;
              return <a key={link.id} href={safeExternalUrl(link.url)} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}><Icon size={19} /></a>;
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
