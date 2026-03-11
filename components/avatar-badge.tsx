import type { Member } from "@/lib/members";
import { getAvatarTone, getInitials } from "@/lib/directory";

type AvatarBadgeProps = {
  member: Member;
  size?: "sm" | "lg";
};

export function AvatarBadge({ member, size = "sm" }: AvatarBadgeProps) {
  const wrapperSize = size === "lg" ? "h-14 w-14 text-sm" : "h-10 w-10 text-[0.68rem]";

  if (member.avatar) {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 ${wrapperSize}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={member.name} className="h-full w-full object-cover" src={member.avatar} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br ${getAvatarTone(member.id)} font-mono font-medium uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_30px_rgba(157,245,207,0.18)] ${wrapperSize}`}
    >
      {getInitials(member.name)}
    </span>
  );
}
