"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { AvatarBadge } from "@/components/avatar-badge";
import { BuildProvenancePanel } from "@/components/build-provenance";
import { ArrowUpRightIcon } from "@/components/icons";
import { formatWebsiteLabel } from "@/lib/directory";
import type { BuildProvenance } from "@/lib/build-provenance";
import type { Member } from "@/lib/members";

const DIRECTORY_RETURN_HREF = "/?skipIntro=1";
const easing = [0.22, 1, 0.36, 1] as const;
const sectionViewport = { once: true, amount: 0.24 } as const;

type MemberProfilePageProps = {
  buildProvenance: BuildProvenance;
  member: Member;
};

function getRevealInitial(prefersReducedMotion: boolean | null, offset = 22) {
  return prefersReducedMotion ? false : { opacity: 0, y: offset };
}

function getRevealTransition(
  prefersReducedMotion: boolean | null,
  delay = 0,
  duration = 0.55,
) {
  return prefersReducedMotion
    ? { duration: 0 }
    : { duration, delay, ease: easing };
}

function getHoverLift(prefersReducedMotion: boolean | null, lift = 6) {
  return prefersReducedMotion ? undefined : { y: -lift };
}

function FloatingAccent({
  className,
  delay = 0,
  duration = 14,
  offset = 22,
}: {
  className: string;
  delay?: number;
  duration?: number;
  offset?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={false}
      animate={
        prefersReducedMotion
          ? { opacity: 0.44, scale: 1, x: 0, y: 0 }
          : {
              opacity: [0.28, 0.48, 0.34, 0.28],
              scale: [1, 1.08, 0.94, 1],
              x: [0, offset, -offset / 2, 0],
              y: [0, -offset * 0.55, offset * 0.35, 0],
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration,
              delay,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
            }
      }
    />
  );
}

function InfoCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className="surface-panel rounded-[1.5rem] px-5 py-4"
      initial={getRevealInitial(prefersReducedMotion, 18)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={sectionViewport}
      transition={getRevealTransition(prefersReducedMotion, delay, 0.42)}
      whileHover={getHoverLift(prefersReducedMotion, 5)}
    >
      <p className="micro-label text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--text)]">{value}</p>
    </motion.article>
  );
}

function TagSection({
  items,
  label,
  delay = 0,
}: {
  items: string[];
  label: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="surface-panel rounded-[1.75rem] px-6 py-5"
      initial={getRevealInitial(prefersReducedMotion, 24)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={sectionViewport}
      transition={getRevealTransition(prefersReducedMotion, delay)}
      whileHover={getHoverLift(prefersReducedMotion, 4)}
    >
      <p className="micro-label text-[var(--muted)]">{label}</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {items.map((item, index) => (
          <motion.span
            key={`${label}-${item}`}
            className="tag-button inline-flex rounded-full px-3 py-1.5 text-sm leading-5"
            initial={getRevealInitial(prefersReducedMotion, 12)}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={sectionViewport}
            transition={getRevealTransition(prefersReducedMotion, delay + 0.06 + index * 0.03, 0.34)}
            whileHover={
              prefersReducedMotion
                ? undefined
                : { y: -3, scale: 1.03, transition: { duration: 0.18, ease: easing } }
            }
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.section>
  );
}

function ExternalLinkCard({
  href,
  label,
  delay = 0,
}: {
  href: string;
  label: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      className="group flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--panel-soft-strong)]"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={getRevealInitial(prefersReducedMotion, 16)}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={sectionViewport}
      transition={getRevealTransition(prefersReducedMotion, delay, 0.4)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -4, x: 2, transition: { duration: 0.2, ease: easing } }
      }
    >
      <div className="space-y-1">
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--muted)]">{formatWebsiteLabel(href)}</p>
      </div>
      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </motion.a>
  );
}

function PrimaryWebsiteLink({
  href,
  delay = 0,
}: {
  href: string;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      className="group flex w-full items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--panel-soft-strong)] sm:max-w-sm"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={getRevealInitial(prefersReducedMotion, 14)}
      animate={{ opacity: 1, y: 0 }}
      transition={getRevealTransition(prefersReducedMotion, delay, 0.36)}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { y: -4, x: 2, transition: { duration: 0.2, ease: easing } }
      }
    >
      <div className="space-y-1">
        <p className="micro-label text-[var(--muted)]">Website</p>
        <p className="text-sm font-medium text-[var(--text)]">{formatWebsiteLabel(href)}</p>
      </div>
      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </motion.a>
  );
}

function SocialLinks({ member }: { member: Member }) {
  const prefersReducedMotion = useReducedMotion();
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
      {links.map((link, index) => (
        <motion.a
          key={link.label}
          className="tag-button inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={getRevealInitial(prefersReducedMotion, 10)}
          animate={{ opacity: 1, y: 0 }}
          transition={getRevealTransition(prefersReducedMotion, 0.22 + index * 0.05, 0.3)}
          whileHover={
            prefersReducedMotion
              ? undefined
              : { y: -3, scale: 1.03, transition: { duration: 0.18, ease: easing } }
          }
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  );
}

export function MemberProfilePage({
  buildProvenance,
  member,
}: MemberProfilePageProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasStarterProfile =
    member.profile.about.includes("Replace this starter copy with your own voice.") &&
    member.profile.majorYear === "Add your major and graduation year.";
  const profileFacts = [
    ...(member.university
      ? [{ label: "University", value: member.university }]
      : []),
    { label: "Major / year", value: member.profile.majorYear },
    { label: "Location", value: member.profile.location },
    { label: "Builder type", value: member.profile.builderType },
  ];

  return (
    <motion.main
      className="relative min-h-screen overflow-hidden px-4 py-6 text-[var(--text)] sm:px-6 sm:py-8 lg:px-8"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={getRevealTransition(prefersReducedMotion)}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingAccent className="absolute left-[-4rem] top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(37,128,255,0.3),_transparent_68%)] blur-3xl" />
        <FloatingAccent
          className="absolute right-[-2rem] top-36 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(176,109,255,0.22),_transparent_72%)] blur-3xl"
          delay={1.2}
          duration={18}
          offset={28}
        />
        <FloatingAccent
          className="absolute bottom-20 left-[14%] h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(166,227,150,0.28),_transparent_70%)] blur-3xl"
          delay={0.4}
          duration={16}
          offset={18}
        />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-8">
        <motion.header
          className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"
          initial={getRevealInitial(prefersReducedMotion, 20)}
          animate={{ opacity: 1, y: 0 }}
          transition={getRevealTransition(prefersReducedMotion, 0.02)}
        >
          <motion.div
            className="space-y-4"
            initial={getRevealInitial(prefersReducedMotion, 16)}
            animate={{ opacity: 1, y: 0 }}
            transition={getRevealTransition(prefersReducedMotion, 0.06)}
          >
            <p className="micro-label text-[var(--muted)]">Codex Lab</p>
            <div className="space-y-4">
              <h1 className="text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[var(--text)] sm:text-5xl">
                {member.name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
                {member.profile.headline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={getRevealInitial(prefersReducedMotion, 12)}
            animate={{ opacity: 1, y: 0 }}
            transition={getRevealTransition(prefersReducedMotion, 0.12, 0.4)}
            whileHover={getHoverLift(prefersReducedMotion, 3)}
          >
            <Link
              className="tag-button inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-strong)]"
              href={DIRECTORY_RETURN_HREF}
            >
              Back to directory
            </Link>
          </motion.div>
        </motion.header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
          <motion.section
            className="surface-panel relative overflow-hidden rounded-[1.75rem] px-6 py-6"
            initial={getRevealInitial(prefersReducedMotion, 24)}
            animate={{ opacity: 1, y: 0 }}
            transition={getRevealTransition(prefersReducedMotion, 0.1)}
            whileHover={getHoverLift(prefersReducedMotion, 4)}
          >
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-2.5rem] top-[-1.5rem] h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(37,128,255,0.18),_transparent_68%)] blur-2xl"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.4 }
                  : {
                      opacity: [0.2, 0.48, 0.24],
                      scale: [1, 1.1, 0.96],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 8,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                    }
              }
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
              <motion.div
                initial={getRevealInitial(prefersReducedMotion, 16)}
                animate={{ opacity: 1, y: 0 }}
                transition={getRevealTransition(prefersReducedMotion, 0.16, 0.42)}
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [0, -6, 0],
                          rotate: [0, -1.5, 0],
                          scale: [1, 1.03, 1],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 6.5,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                        }
                  }
                >
                  <AvatarBadge member={member} size="lg" />
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={getRevealInitial(prefersReducedMotion, 18)}
                animate={{ opacity: 1, y: 0 }}
                transition={getRevealTransition(prefersReducedMotion, 0.2, 0.44)}
              >
                <p className="text-lg leading-8 text-[var(--text)]">
                  {member.profile.about}
                </p>

                {hasStarterProfile ? (
                  <motion.div
                    className="rounded-[1.25rem] border border-[var(--border-strong)] bg-[var(--panel-soft)] px-4 py-3 text-sm leading-6 text-[var(--text)]"
                    initial={getRevealInitial(prefersReducedMotion, 12)}
                    animate={{ opacity: 1, y: 0 }}
                    transition={getRevealTransition(prefersReducedMotion, 0.24, 0.34)}
                    whileHover={getHoverLift(prefersReducedMotion, 3)}
                  >
                    This starter page is meant to be customized. Update the shared
                    fields in <code>lib/members.ts</code> and add extra sections
                    if you want to make it your own.
                  </motion.div>
                ) : null}

                {member.website ? (
                  <PrimaryWebsiteLink href={member.website} delay={0.26} />
                ) : null}

                <SocialLinks member={member} />
              </motion.div>
            </div>
          </motion.section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {profileFacts.map((fact, index) => (
              <InfoCard
                key={fact.label}
                label={fact.label}
                value={fact.value}
                delay={0.14 + index * 0.05}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TagSection items={member.profile.interests} label="Interests" delay={0.04} />
          <TagSection items={member.profile.tools} label="Tools used" delay={0.08} />
        </div>

        <motion.section
          className="surface-panel rounded-[1.75rem] px-6 py-6"
          initial={getRevealInitial(prefersReducedMotion, 26)}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={getRevealTransition(prefersReducedMotion, 0.04)}
        >
          <div className="space-y-2">
            <p className="micro-label text-[var(--muted)]">Projects / startup</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              What they&apos;re building
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {member.profile.projects.map((project, index) => (
              <motion.article
                key={`${member.id}-${project.name}`}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-4"
                initial={getRevealInitial(prefersReducedMotion, 18)}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={getRevealTransition(prefersReducedMotion, 0.08 + index * 0.05, 0.42)}
                whileHover={
                  prefersReducedMotion
                    ? undefined
                    : { y: -6, scale: 1.01, transition: { duration: 0.2, ease: easing } }
                }
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
                    <motion.a
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel-strong)] transition-colors hover:border-[var(--border-strong)]"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name}`}
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : {
                              rotate: 8,
                              scale: 1.08,
                              transition: { duration: 0.18, ease: easing },
                            }
                      }
                    >
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </motion.a>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="surface-panel rounded-[1.75rem] px-6 py-6"
          initial={getRevealInitial(prefersReducedMotion, 26)}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={getRevealTransition(prefersReducedMotion, 0.06)}
        >
          <div className="space-y-2">
            <p className="micro-label text-[var(--muted)]">Repo / demo links</p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              Links worth opening
            </h2>
          </div>

          {member.profile.repoDemoLinks.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {member.profile.repoDemoLinks.map((link, index) => (
                <ExternalLinkCard
                  key={`${member.id}-${link.href}`}
                  href={link.href}
                  label={link.label}
                  delay={0.1 + index * 0.05}
                />
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
              Add links to repos, demos, or a personal site in{" "}
              <code>lib/members.ts</code>.
            </p>
          )}
        </motion.section>

        {member.profile.customSections.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {member.profile.customSections.map((section, index) => (
              <motion.section
                key={`${member.id}-${section.title}`}
                className="surface-panel rounded-[1.75rem] px-6 py-6"
                initial={getRevealInitial(prefersReducedMotion, 24)}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={sectionViewport}
                transition={getRevealTransition(prefersReducedMotion, 0.08 + index * 0.05)}
                whileHover={getHoverLift(prefersReducedMotion, 4)}
              >
                <p className="micro-label text-[var(--muted)]">Custom section</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text)]">
                  {section.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {section.body}
                </p>
              </motion.section>
            ))}
          </div>
        ) : null}

        <motion.div
          initial={getRevealInitial(prefersReducedMotion, 18)}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={sectionViewport}
          transition={getRevealTransition(prefersReducedMotion, 0.08, 0.44)}
        >
          <BuildProvenancePanel buildProvenance={buildProvenance} />
        </motion.div>
      </div>
    </motion.main>
  );
}
