import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { MemberTable } from "@/components/member-table";
import type { Member } from "@/lib/members";

const sampleMembers: Member[] = [
  {
    id: "noor-akhtar",
    name: "Noor Akhtar",
    focus: "Applied research for knowledge systems and memory layers",
    disciplines: ["Research"],
    domains: ["Knowledge systems", "Agents"],
    links: {
      linkedin: "https://www.linkedin.com/in/noorakhtar",
    },
    connections: [],
  },
  {
    id: "sage-bell",
    name: "Sage Bell",
    focus: "Ops infrastructure for experiments and reliable rollouts",
    disciplines: ["Operations", "Engineering"],
    domains: ["Automation", "Developer tools"],
    links: {},
    connections: [],
  },
];

describe("MemberTable", () => {
  test("renders the fixed directory columns and placeholder states", () => {
    render(
      <MemberTable
        members={sampleMembers}
        totalMembers={sampleMembers.length}
        selectedId={null}
        connectedIds={new Set()}
        onSelect={() => {}}
        onHover={() => {}}
      />,
    );

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("focus")).toBeInTheDocument();
    expect(screen.getByText("site")).toBeInTheDocument();
    expect(screen.getByText("links")).toBeInTheDocument();
    expect(screen.getByText("2 members")).toBeInTheDocument();
    expect(screen.getAllByText("Noor Akhtar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  test("calls onSelect when a row is activated", () => {
    const handleSelect = vi.fn();

    render(
      <MemberTable
        members={sampleMembers}
        totalMembers={sampleMembers.length}
        selectedId={null}
        connectedIds={new Set()}
        onSelect={handleSelect}
        onHover={() => {}}
      />,
    );

    fireEvent.click(screen.getAllByText("Sage Bell")[0]);

    expect(handleSelect).toHaveBeenCalledWith("sage-bell");
  });
});
