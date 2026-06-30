import Image from "next/image";
import { getProfileUrl, type CastMember } from "@/lib/tmdb";

type CastCardProps = {
  member: CastMember;
};

export default function CastCard({ member }: CastCardProps) {
  const profileUrl = getProfileUrl(member.profilePath);

  return (
    <div className="w-32 shrink-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-neutral-900">
        {member.profilePath ? (
          <Image
            src={profileUrl}
            alt={member.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-500">
            Pas de photo
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="line-clamp-1 text-sm font-medium text-white">
          {member.name}
        </p>
        <p className="line-clamp-1 text-xs text-neutral-400">
          {member.character}
        </p>
      </div>
    </div>
  );
}
