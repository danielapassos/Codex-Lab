import Link from "next/link";

import { AvatarBadge } from "@/components/avatar-badge";
import {
  ArrowUpRightIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons";
import { formatWebsiteLabel } from "@/lib/directory";
import type { Member } from "@/lib/members";

type MemberTableProps = {
  members: Member[];
  selectedId?: string | null;
  hoveredId?: string | null;
  connectedIds?: Set<string>;
  onHover?: (memberId: string | null) => void;
};

function LinkIcon({
  href,
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return null;
  }

  return (
    <a
      className="inline-flex h-6 w-6 items-center justify-center text-[var(--text)]/72 transition-colors hover:text-[var(--text)]"
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function EmptyCell({ minHeight = "min-h-[1.5rem]" }: { minHeight?: string }) {
  return <span aria-hidden="true" className={`block ${minHeight}`} />;
}

function WebsiteCell({ member }: { member: Member }) {
  if (!member.website) {
    return <EmptyCell />;
  }

  return (
    <a
      className="inline-flex max-w-full min-w-0 items-center gap-1.5 text-[var(--text)] transition-colors hover:text-[var(--accent)]"
      href={member.website}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="min-w-0 truncate">{formatWebsiteLabel(member.website)}</span>
      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

function SocialLinks({ member }: { member: Member }) {
  return (
    <div className="flex min-h-[1.5rem] items-center gap-3">
      <LinkIcon href={member.links.instagram} label={`${member.name} on Instagram`}>
        <InstagramIcon className="h-5 w-5" />
      </LinkIcon>
      <LinkIcon href={member.links.x} label={`${member.name} on X`}>
        <XIcon className="h-5 w-5" />
      </LinkIcon>
      <LinkIcon href={member.links.linkedin} label={`${member.name} on LinkedIn`}>
        <LinkedInIcon className="h-5 w-5" />
      </LinkIcon>
    </div>
  );
}

function MemberNameLink({
  member,
  onHover,
}: {
  member: Member;
  onHover?: (memberId: string | null) => void;
}) {
  return (
    <Link
      className="transition-colors hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none"
      href={`/members/${member.id}`}
      onFocus={() => onHover?.(member.id)}
      onBlur={() => onHover?.(null)}
    >
      {member.name}
    </Link>
  );
}

export function MemberTable({
  members,
  selectedId = null,
  hoveredId = null,
  connectedIds,
  onHover,
}: MemberTableProps) {
  const hasAnyWebsite = members.some((member) => Boolean(member.website));

  return (
    <section aria-label="Student directory" className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <div className="space-y-2">
          <p className="micro-label text-[var(--muted)]">Directory</p>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
            Students
          </h2>
        </div>
        <p className="micro-label text-[var(--muted)]">{members.length} students</p>
      </div>

      <div className="space-y-3 xl:hidden">
        {members.length === 0 ? (
          <div className="surface-panel rounded-[1.5rem] px-5 py-8 text-sm text-[var(--muted)]">
            No students are available yet.
          </div>
        ) : null}

        {members.map((member) => {
          const isSelected = member.id === selectedId;
          const isHovered = member.id === hoveredId;
          const isConnected = connectedIds?.has(member.id) ?? false;

          return (
            <article
              key={member.id}
              data-member-card={member.id}
              className={`surface-panel rounded-[1.5rem] px-4 py-4 transition-colors ${
                isSelected
                  ? "border-[var(--border-strong)] bg-[var(--panel-strong)]"
                  : isHovered
                    ? "bg-[var(--panel-soft)]"
                  : isConnected
                    ? "bg-[var(--panel-soft)]"
                    : ""
              }`.trim()}
              onMouseEnter={() => onHover?.(member.id)}
              onMouseLeave={() => onHover?.(null)}
            >
              <div className="flex items-center gap-3">
                <AvatarBadge member={member} />
                <p className="text-base font-medium text-[var(--text)]">
                  <MemberNameLink member={member} onHover={onHover} />
                </p>
              </div>

              <div
                className={`mt-4 gap-x-4 gap-y-3 text-sm ${
                  hasAnyWebsite ? "grid grid-cols-2" : "space-y-3"
                }`}
              >
                 <div className="min-w-0 space-y-1">
                   <p className="micro-label text-[var(--muted)]">university</p>
                   <p className="break-words text-[var(--text)]">
                     {member.university ?? <EmptyCell />}
                   </p>
                 </div>

                 {hasAnyWebsite ? (
                   <div className="min-w-0 space-y-1">
                     <p className="micro-label text-[var(--muted)]">site</p>
                     <div className="text-[var(--text)]">
                       <WebsiteCell member={member} />
                     </div>
                  </div>
                ) : null}

                <div className={`min-w-0 space-y-1 ${hasAnyWebsite ? "col-span-2" : ""}`}>
                  <p className="micro-label text-[var(--muted)]">links</p>
                  <SocialLinks member={member} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-[1.75rem] xl:block">
        <div className="surface-panel overflow-x-auto">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className={hasAnyWebsite ? "w-[34%]" : "w-[42%]"} />
              <col className={hasAnyWebsite ? "w-[24%]" : "w-[28%]"} />
              {hasAnyWebsite ? <col className="w-[22%]" /> : null}
              <col className={hasAnyWebsite ? "w-[20%]" : "w-[30%]"} />
            </colgroup>
            <thead className="border-b border-[var(--border)] bg-[var(--panel-strong)]">
              <tr className="micro-label text-left text-[var(--muted)]">
                <th className="px-5 py-4 font-medium">name</th>
                <th className="px-5 py-4 font-medium">university</th>
                {hasAnyWebsite ? <th className="px-5 py-4 font-medium">site</th> : null}
                <th className="px-5 py-4 font-medium">links</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-10 text-sm text-[var(--muted)]"
                    colSpan={hasAnyWebsite ? 4 : 3}
                  >
                    No students are available yet.
                  </td>
                </tr>
              ) : null}

              {members.map((member) => {
                const isSelected = member.id === selectedId;
                const isHovered = member.id === hoveredId;
                const isConnected = connectedIds?.has(member.id) ?? false;

                return (
                  <tr
                    key={member.id}
                    data-member-row={member.id}
                    className={`border-t border-[var(--border)] transition-colors ${
                      isSelected
                        ? "bg-[var(--panel-soft-strong)]"
                        : isHovered
                          ? "bg-[var(--panel-soft)]"
                        : isConnected
                          ? "bg-[var(--panel-soft)]"
                          : "hover:bg-[var(--panel-soft)]"
                    }`.trim()}
                    onMouseEnter={() => onHover?.(member.id)}
                    onMouseLeave={() => onHover?.(null)}
                  >
                    <td className="px-5 py-5 align-middle">
                      <div className="flex items-center gap-4">
                        <AvatarBadge member={member} />
                        <p className="truncate text-sm font-medium text-[var(--text)]">
                          <MemberNameLink member={member} onHover={onHover} />
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5 align-middle text-sm text-[var(--text)]">
                      {member.university ?? <EmptyCell />}
                    </td>
                    {hasAnyWebsite ? (
                      <td className="px-5 py-5 align-middle text-sm text-[var(--text)]">
                        <WebsiteCell member={member} />
                      </td>
                    ) : null}
                    <td className="px-5 py-5 align-middle">
                      <SocialLinks member={member} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
