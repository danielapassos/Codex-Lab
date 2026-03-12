import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DirectoryHome } from "@/components/directory-home";
import type { Member } from "@/lib/members";

class ResizeObserverMock {
  observe() {}

  disconnect() {}
}

const sampleProfile = {
  headline: "Student builder in the Codex Lab cohort.",
  majorYear: "Computer Science, 2027",
  location: "Berkeley, CA",
  builderType: "Student builder",
  interests: ["AI tooling", "Hackathons"],
  tools: ["Codex", "Next.js"],
  projects: [
    {
      name: "Codex Lab profile",
      summary: "A starter member page for the directory.",
    },
  ],
  repoDemoLinks: [],
  about: "Short profile copy for the member page.",
  customSections: [],
};

const members: Member[] = [
  {
    id: "jason-yi",
    name: "Jason Yi",
    university: "Stanford",
    profile: sampleProfile,
    links: {
      linkedin: "https://www.linkedin.com/in/jasonyi33/",
    },
  },
  {
    id: "jay-khemchandani",
    name: "Jay Khemchandani",
    university: "Stanford",
    profile: sampleProfile,
    links: {
      linkedin: "https://www.linkedin.com/in/jay-khemchandani/",
    },
  },
  {
    id: "dylan-li",
    name: "Dylan Li",
    university: "Michigan",
    profile: sampleProfile,
    links: {
      linkedin: "https://www.linkedin.com/in/dylan-li/",
    },
  },
];

describe("DirectoryHome", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("hovering a student only highlights that row", () => {
    const { container } = render(
      <DirectoryHome
        buildProvenance={{
          isGitDeployment: false,
          isProduction: false,
          isVercel: false,
        }}
        initialMembers={members}
      />,
    );

    const hoveredRow = container.querySelector(
      '[data-member-row="jason-yi"]',
    ) as HTMLTableRowElement | null;
    const connectedRow = container.querySelector(
      '[data-member-row="jay-khemchandani"]',
    ) as HTMLTableRowElement | null;

    expect(hoveredRow).not.toBeNull();
    expect(connectedRow).not.toBeNull();

    fireEvent.mouseEnter(hoveredRow!);

    expect(hoveredRow).toHaveClass("bg-[var(--panel-soft)]");
    expect(connectedRow).not.toHaveClass("bg-[var(--panel-soft)]");
  });
});
