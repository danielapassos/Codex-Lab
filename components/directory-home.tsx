"use client";

import { BuildProvenancePanel } from "@/components/build-provenance";
import type { BuildProvenance } from "@/lib/build-provenance";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { MemberTable } from "@/components/member-table";
import { NetworkGraph } from "@/components/network-graph";
import { getConnectedMemberIds } from "@/lib/directory";
import type { Member } from "@/lib/members";

type DirectoryHomeProps = {
  buildProvenance: BuildProvenance;
  initialMembers: Member[];
};

const easing = [0.22, 1, 0.36, 1] as const;

export function DirectoryHome({
  buildProvenance,
  initialMembers,
}: DirectoryHomeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const focusedId = hoveredId ?? selectedId;
  const connectedIds = getConnectedMemberIds(focusedId, initialMembers);
  const revealTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: easing };

  return (
    <motion.main
      className="min-h-screen px-4 py-6 text-[var(--text)] sm:px-6 sm:py-8 lg:px-8"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={revealTransition}
    >
      <div className="mx-auto max-w-7xl">
        <motion.header
          className="max-w-3xl space-y-4"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
        >
          <div className="space-y-2">
            <p className="micro-label text-[var(--muted)]">ChatGPT Lab</p>
            <h1 className="text-[2.5rem] font-semibold leading-none tracking-[-0.05em] text-[var(--text)] sm:text-5xl">
              Student directory
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
            Built from the student onboarding responses you shared, with public
            profile photos and social links where they were available.
          </p>
        </motion.header>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.98fr)] xl:items-start">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: prefersReducedMotion ? 0 : 0.04 }}
          >
            <MemberTable members={initialMembers} />
          </motion.div>

          <motion.div
            className="xl:sticky xl:top-8"
            initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...revealTransition, delay: prefersReducedMotion ? 0 : 0.08 }}
          >
            <NetworkGraph
              members={initialMembers}
              selectedId={selectedId}
              hoveredId={hoveredId}
              connectedIds={connectedIds}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...revealTransition, delay: prefersReducedMotion ? 0 : 0.12 }}
        >
          <BuildProvenancePanel buildProvenance={buildProvenance} />
        </motion.div>
      </div>
    </motion.main>
  );
}
