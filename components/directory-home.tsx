"use client";

import { startTransition, useDeferredValue, useState } from "react";

import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { MemberTable } from "@/components/member-table";
import { NetworkGraph } from "@/components/network-graph";
import {
  filterMembers,
  getConnectedMemberIds,
  getFilterOptions,
} from "@/lib/directory";
import type { Member } from "@/lib/members";

type DirectoryHomeProps = {
  initialMembers: Member[];
  joinFormUrl: string;
  usingPlaceholderJoinForm: boolean;
};

function toggleValue(values: string[], nextValue: string) {
  return values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];
}

function FilterGroup({
  label,
  options,
  selectedValues,
  onToggle,
}: {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (nextValue: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="micro-label text-[var(--muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              className="tag-button rounded-full px-3 py-2 text-sm transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              data-active={isActive}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchPanel({
  hasActiveFilters,
  query,
  onClearAll,
  onQueryChange,
}: {
  hasActiveFilters: boolean;
  query: string;
  onClearAll: () => void;
  onQueryChange: (nextValue: string) => void;
}) {
  return (
    <section className="surface-panel rounded-[1.75rem] p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="micro-label text-[var(--muted)]">Search the network</p>

          {hasActiveFilters ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
              onClick={onClearAll}
            >
              <CloseIcon />
              Clear all
            </button>
          ) : null}
        </div>

        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-[var(--panel-soft)] px-4 py-3 text-[var(--muted)] focus-within:border-[var(--border-strong)] focus-within:text-[var(--text)]">
          <SearchIcon />
          <input
            aria-label="Search members"
            className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
            placeholder="search members, focus, or domains..."
            value={query}
            onChange={(event) => {
              onQueryChange(event.target.value);
            }}
          />
        </label>
      </div>
    </section>
  );
}

export function DirectoryHome({
  initialMembers,
  joinFormUrl,
  usingPlaceholderJoinForm,
}: DirectoryHomeProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [disciplineFilters, setDisciplineFilters] = useState<string[]>([]);
  const [domainFilters, setDomainFilters] = useState<string[]>([]);

  const deferredQuery = useDeferredValue(query);
  const filterOptions = getFilterOptions(initialMembers);
  const filteredMembers = filterMembers(
    initialMembers,
    deferredQuery,
    new Set(disciplineFilters),
    new Set(domainFilters),
  );
  const resolvedSelectedId = filteredMembers.some((member) => member.id === selectedId)
    ? selectedId
    : null;
  const selectedMember =
    filteredMembers.find((member) => member.id === resolvedSelectedId) ?? null;
  const focusedId = hoveredId ?? resolvedSelectedId;
  const connectedIds = getConnectedMemberIds(focusedId, filteredMembers);
  const hasActiveFilters =
    query.trim().length > 0 ||
    disciplineFilters.length > 0 ||
    domainFilters.length > 0;

  const clearAllFilters = () => {
    setQuery("");
    setDisciplineFilters([]);
    setDomainFilters([]);
  };

  const handleQueryChange = (nextValue: string) => {
    startTransition(() => {
      setQuery(nextValue);
    });
  };

  return (
    <main className="min-h-screen px-4 py-5 text-[var(--text)] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] xl:items-start">
          <div className="space-y-6 sm:space-y-8">
            <header className="space-y-6">
              <div className="space-y-3">
                <p className="micro-label text-[var(--accent)]">Codex Lab</p>
                <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--text)] sm:text-5xl">
                  A directory-first network for the people building with the Lab.
                </h1>
              </div>

              <div className="max-w-2xl space-y-4 text-base leading-8 text-[var(--muted)]">
                <p>
                  Codex Lab gathers engineers, researchers, designers, and operators
                  around ambitious experiments. This is the place to find the people
                  shaping them.
                </p>
                <p>
                  Browse the directory, trace who works closely together, and surface
                  the collaborators who can move an idea forward.
                </p>
                <p>
                  want to be part of the Lab?{" "}
                  <a
                    className="inline-flex items-center gap-1.5 font-medium text-[var(--text)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
                    href={joinFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-placeholder={usingPlaceholderJoinForm}
                  >
                    fill out this form
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                </p>
              </div>
            </header>

            <SearchPanel
              hasActiveFilters={hasActiveFilters}
              query={query}
              onClearAll={clearAllFilters}
              onQueryChange={handleQueryChange}
            />

            <MemberTable
              members={filteredMembers}
              totalMembers={initialMembers.length}
              selectedId={resolvedSelectedId}
              connectedIds={connectedIds}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </div>

          <div className="space-y-6 xl:sticky xl:top-8">
            <NetworkGraph
              members={filteredMembers}
              selectedId={resolvedSelectedId}
              hoveredId={hoveredId}
              connectedIds={connectedIds}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />

            <section className="surface-panel rounded-[1.75rem] p-5">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="micro-label text-[var(--muted)]">Selected</p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
                        {selectedMember ? selectedMember.name : "Pick a member to focus"}
                      </h2>
                    </div>
                    {selectedMember ? (
                      <button
                        type="button"
                        className="rounded-full border border-white/10 p-2 text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
                        aria-label="Clear selected member"
                        onClick={() => setSelectedId(null)}
                      >
                        <CloseIcon />
                      </button>
                    ) : null}
                  </div>

                  {selectedMember ? (
                    <>
                      <p className="text-sm leading-7 text-[var(--muted)]">
                        {selectedMember.focus}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.disciplines.map((discipline) => (
                          <span
                            key={discipline}
                            className="rounded-full border border-white/10 bg-white/4 px-3 py-1.5 text-sm text-[var(--text)]"
                          >
                            {discipline}
                          </span>
                        ))}
                        {selectedMember.domains.map((domain) => (
                          <span
                            key={domain}
                            className="rounded-full border border-[var(--border-strong)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm text-[var(--text)]"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm leading-7 text-[var(--muted)]">
                      Click a row or graph node to highlight that member and the people
                      directly connected to them.
                    </p>
                  )}
                </div>

                <div className="space-y-5 border-t border-white/8 pt-5">
                  <FilterGroup
                    label="Disciplines"
                    options={filterOptions.disciplines}
                    selectedValues={disciplineFilters}
                    onToggle={(nextValue) => {
                      setDisciplineFilters((currentValues) =>
                        toggleValue(currentValues, nextValue),
                      );
                    }}
                  />

                  <FilterGroup
                    label="Domains"
                    options={filterOptions.domains}
                    selectedValues={domainFilters}
                    onToggle={(nextValue) => {
                      setDomainFilters((currentValues) =>
                        toggleValue(currentValues, nextValue),
                      );
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
