import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { MemberTable } from "@/components/member-table";
import type { Member } from "@/lib/members";

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

const sampleMembers: Member[] = [
  {
    id: "jason-yi",
    name: "Jason Yi",
    university: "UC Berkeley",
    profile: sampleProfile,
    links: {
      instagram: "https://www.instagram.com/jasonyi33/",
      linkedin: "https://www.linkedin.com/in/jasonyi33/",
      x: "https://x.com/jasonyi361",
    },
  },
  {
    id: "james-masson",
    name: "James Masson",
    profile: sampleProfile,
    links: {
      linkedin: "https://www.linkedin.com/in/james-masson-94a390257/",
    },
  },
];

describe("MemberTable", () => {
  test("renders the student directory columns and blank cells", () => {
    render(<MemberTable members={sampleMembers} />);

    expect(screen.getAllByText("name").length).toBeGreaterThan(0);
    expect(screen.getAllByText("university").length).toBeGreaterThan(0);
    expect(screen.queryByText("site")).not.toBeInTheDocument();
    expect(screen.getAllByText("links").length).toBeGreaterThan(0);
    expect(screen.getByText("2 students")).toBeInTheDocument();
    expect(screen.getAllByText("Jason Yi").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Jason Yi" })[0]).toHaveAttribute(
      "href",
      "/members/jason-yi",
    );
    expect(screen.getAllByRole("link", { name: "James Masson" })[0]).toHaveAttribute(
      "href",
      "/members/james-masson",
    );
    expect(screen.getAllByLabelText("Jason Yi on Instagram")).toHaveLength(2);
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  test("renders working social links", () => {
    render(<MemberTable members={sampleMembers} />);

    fireEvent.click(screen.getAllByLabelText("James Masson on LinkedIn")[0]);

    expect(screen.getAllByLabelText("James Masson on LinkedIn")[0]).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/james-masson-94a390257/",
    );
  });
});
