"use client";

import { AvatarBadge } from "@/components/avatar-badge";
import {
  ArrowUpRightIcon,
  GithubIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons";
import { formatWebsiteLabel } from "@/lib/directory";
import type { Member } from "@/lib/members";

type MemberTableProps = {
  members: Member[];
  totalMembers: number;
  selectedId: string | null;
  connectedIds: Set<string>;
  onSelect: (memberId: string | null) => void;
  onHover: (memberId: string | null) => void;
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
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/4 text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:bg-white/8 hover:text-[var(--text)]"
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {children}
    </a>
  );
}

export function MemberTable({
  members,
  totalMembers,
  selectedId,
  connectedIds,
  onSelect,
  onHover,
}: MemberTableProps) {
  const countLabel =
    members.length === totalMembers
      ? `${totalMembers} members`
      : `${members.length} of ${totalMembers} members`;

  return (
    <section aria-label="Lab member directory" className="space-y-4 sm:space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="micro-label text-[var(--muted)]">Directory</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
            Browse the people building around the Lab
          </h2>
        </div>
        <p className="micro-label text-[var(--muted)]">{countLabel}</p>
      </div>

      <div className="space-y-3 xl:hidden">
        {members.length === 0 ? (
          <div className="surface-panel rounded-[1.75rem] px-5 py-8 text-sm text-[var(--muted)]">
            No members match the current search and filters yet.
          </div>
        ) : null}

        {members.map((member) => {
          const isSelected = member.id === selectedId;
          const isConnected = connectedIds.has(member.id) && !isSelected;

          return (
            <article
              key={member.id}
              aria-pressed={isSelected}
              className={`surface-panel rounded-[1.5rem] px-4 py-4 transition-colors ${
                isSelected
                  ? "bg-[var(--accent-soft)]"
                  : isConnected
                    ? "bg-white/[0.035]"
                    : "bg-transparent hover:bg-white/[0.025]"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(isSelected ? null : member.id)}
              onFocus={() => onHover(member.id)}
              onBlur={() => onHover(null)}
              onMouseEnter={() => onHover(member.id)}
              onMouseLeave={() => onHover(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(isSelected ? null : member.id);
                }
              }}
            >
              <div className="space-y-3 sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,0.95fr)_auto] sm:items-start sm:gap-4 sm:space-y-0">
                <div className="flex min-w-0 items-center gap-3">
                  <AvatarBadge member={member} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text)]">
                      {member.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {member.disciplines.join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="min-w-0 sm:pt-1">
                  {member.website ? (
                    <a
                      className="inline-flex max-w-full items-center gap-1.5 text-sm text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <span className="truncate">{formatWebsiteLabel(member.website)}</span>
                      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm text-[var(--muted)]/70">—</span>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <LinkIcon href={member.links.github} label={`${member.name} on GitHub`}>
                    <GithubIcon />
                  </LinkIcon>
                  <LinkIcon
                    href={member.links.linkedin}
                    label={`${member.name} on LinkedIn`}
                  >
                    <LinkedInIcon />
                  </LinkIcon>
                  <LinkIcon href={member.links.x} label={`${member.name} on X`}>
                    <XIcon />
                  </LinkIcon>
                  <LinkIcon
                    href={member.links.other}
                    label={`${member.name} external profile`}
                  >
                    <ArrowUpRightIcon />
                  </LinkIcon>
                  {!member.links.github &&
                  !member.links.linkedin &&
                  !member.links.x &&
                  !member.links.other ? (
                    <span className="text-sm text-[var(--muted)]/70">—</span>
                  ) : null}
                </div>

                <p className="text-sm leading-6 text-[var(--muted)] sm:col-span-3">
                  {member.focus}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-[1.75rem] xl:block">
        <div className="surface-panel overflow-x-auto">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[32%]" />
              <col className="w-[20%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead className="border-b border-white/5 bg-[rgba(6,9,15,0.92)]">
              <tr className="micro-label text-left text-[var(--muted)]">
                <th className="px-5 py-4 font-medium">name</th>
                <th className="px-5 py-4 font-medium">focus</th>
                <th className="px-5 py-4 font-medium">site</th>
                <th className="px-5 py-4 font-medium">links</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-sm text-[var(--muted)]" colSpan={4}>
                    No members match the current search and filters yet.
                  </td>
                </tr>
              ) : null}

              {members.map((member) => {
                const isSelected = member.id === selectedId;
                const isConnected = connectedIds.has(member.id) && !isSelected;

                return (
                  <tr
                    key={member.id}
                    aria-selected={isSelected}
                    className={`cursor-pointer border-t border-white/5 transition-colors ${
                      isSelected
                        ? "bg-[var(--accent-soft)]"
                        : isConnected
                          ? "bg-white/[0.035]"
                          : "bg-transparent hover:bg-white/[0.025]"
                    }`}
                    tabIndex={0}
                    onClick={() => onSelect(isSelected ? null : member.id)}
                    onFocus={() => onHover(member.id)}
                    onBlur={() => onHover(null)}
                    onMouseEnter={() => onHover(member.id)}
                    onMouseLeave={() => onHover(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(isSelected ? null : member.id);
                      }
                    }}
                  >
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <AvatarBadge member={member} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--text)]">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {member.disciplines.join(" · ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[16rem] px-5 py-4 align-top text-sm leading-6 text-[var(--text)]">
                      {member.focus}
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-[var(--muted)]">
                      {member.website ? (
                        <a
                          className="inline-flex items-center gap-1.5 text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          <span className="max-w-[11rem] truncate 2xl:max-w-[13rem]">
                            {formatWebsiteLabel(member.website)}
                          </span>
                          <ArrowUpRightIcon className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-[var(--muted)]/70">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-2">
                        <LinkIcon href={member.links.github} label={`${member.name} on GitHub`}>
                          <GithubIcon />
                        </LinkIcon>
                        <LinkIcon
                          href={member.links.linkedin}
                          label={`${member.name} on LinkedIn`}
                        >
                          <LinkedInIcon />
                        </LinkIcon>
                        <LinkIcon href={member.links.x} label={`${member.name} on X`}>
                          <XIcon />
                        </LinkIcon>
                        <LinkIcon
                          href={member.links.other}
                          label={`${member.name} external profile`}
                        >
                          <ArrowUpRightIcon />
                        </LinkIcon>
                        {!member.links.github &&
                        !member.links.linkedin &&
                        !member.links.x &&
                        !member.links.other ? (
                          <span className="text-sm text-[var(--muted)]/70">—</span>
                        ) : null}
                      </div>
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
