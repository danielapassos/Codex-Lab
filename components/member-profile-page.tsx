import Link from "next/link";

import { AvatarBadge } from "@/components/avatar-badge";
import { BuildProvenancePanel } from "@/components/build-provenance";
import { ArrowUpRightIcon } from "@/components/icons";
import { formatWebsiteLabel } from "@/lib/directory";
import type { BuildProvenance } from "@/lib/build-provenance";
import type { Member } from "@/lib/members";

type MemberProfilePageProps = {
  buildProvenance: BuildProvenance;
  member: Member;
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="surface-panel rounded-[1.5rem] px-5 py-4">
      <p className="micro-label text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text)]">{value}</p>
    </article>
  );
}

function TagSection({ items, label }: { items: string[]; label: string }) {
  return (
    <section className="surface-panel rounded-[1.75rem] px-6 py-5">
      <p className="micro-label text-[var(--muted)]">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <span
            key={`${label}-${item}`}
            className="tag-button inline-flex rounded-full px-3 py-1.5 text-sm leading-5"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function ExternalLinkCard({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="group flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--panel-soft-strong)]"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--muted)]">{formatWebsiteLabel(href)}</p>
      </div>
      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function SocialLinks({ member }: { member: Member }) {
  const links = [
    member.links.instagram
      ? { href: member.links.instagram, label: "Instagram" }
      : null,
    member.links.x ? { href: member.links.x, label: "X" } : null,
    member.links.linkedin
      ? { href: member.links.linkedin, label: "LinkedIn" }
      : null,
    member.links.tiktok ? { href: member.links.tiktok, label: "TikTok" } : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.label}
          className="tag-button inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function MemberProfilePage({
  buildProvenance,
  member,
}: MemberProfilePageProps) {
  return (
    <main className="min-h-screen px-4 py-6 text-[var(--text)] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="micro-label text-[var(--muted)]">Codex Lab</p>
            <div className="space-y-4">
              <h1 className="text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[var(--text)] sm:text-5xl">
                {member.name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                {member.profile.headline}
              </p>
            </div>
          </div>

          <Link
            className="tag-button inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]"
            href="/"
          >
            Back to directory
          </Link>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
          <section className="surface-panel rounded-[1.75rem] px-6 py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <AvatarBadge member={member} size="lg" />

              <div className="space-y-4">
                <p className="text-lg leading-8 text-[var(--text)]">
                  {member.profile.about}
                </p>

                <div className="rounded-[1.25rem] border border-[var(--border-strong)] bg-[var(--panel-soft)] px-4 py-3 text-sm leading-6 text-[var(--text)]">
                  This starter page is meant to be customized. Update the shared
                  fields in <code>lib/members.ts</code> and add extra sections
                  if you want to make it your own.
                </div>

                <SocialLinks member={member} />
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {member.university ? (
              <InfoCard label="University" value={member.university} />
            ) : null}
            <InfoCard label="Major / year" value={member.profile.majorYear} />
            <InfoCard label="Location" value={member.profile.location} />
            <InfoCard label="Builder type" value={member.profile.builderType} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TagSection items={member.profile.interests} label="Interests" />
          <TagSection items={member.profile.tools} label="Tools used" />
        </div>

        <section className="surface-panel rounded-[1.75rem] px-6 py-6">
          <div className="space-y-2">
            <p className="micro-label text-[var(--muted)]">Projects / startup</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              What they&apos;re building
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {member.profile.projects.map((project) => (
              <article
                key={`${member.id}-${project.name}`}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[var(--text)]">
                      {project.name}
                    </h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {project.summary}
                    </p>
                  </div>

                  {project.href ? (
                    <a
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel-strong)] transition-colors hover:border-[var(--border-strong)]"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name}`}
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-panel rounded-[1.75rem] px-6 py-6">
          <div className="space-y-2">
            <p className="micro-label text-[var(--muted)]">Repo / demo links</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              Links worth opening
            </h2>
          </div>

          {member.profile.repoDemoLinks.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {member.profile.repoDemoLinks.map((link) => (
                <ExternalLinkCard
                  key={`${member.id}-${link.href}`}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Add links to repos, demos, or a personal site in{" "}
              <code>lib/members.ts</code>.
            </p>
          )}
        </section>

        {member.profile.customSections.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {member.profile.customSections.map((section) => (
              <section
                key={`${member.id}-${section.title}`}
                className="surface-panel rounded-[1.75rem] px-6 py-6"
              >
                <p className="micro-label text-[var(--muted)]">Custom section</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)]">
                  {section.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        ) : null}

        <BuildProvenancePanel buildProvenance={buildProvenance} />
      </div>
    </main>
  );
}
