import { describe, expect, test } from "vitest";

import {
  buildGraphEdges,
  filterMembers,
  getConnectedMemberIds,
  getFilterOptions,
} from "@/lib/directory";
import { members } from "@/lib/members";

describe("directory helpers", () => {
  test("collects sorted filter options", () => {
    const options = getFilterOptions(members);

    expect(options.disciplines).toContain("Engineering");
    expect(options.domains).toContain("Knowledge systems");
    expect(options.disciplines[0]).toBe("Community");
  });

  test("filters members by search text, disciplines, and domains", () => {
    const results = filterMembers(
      members,
      "knowledge",
      new Set(["Research"]),
      new Set(["Agents"]),
    );

    expect(results.map((member) => member.id)).toEqual(["noor-akhtar"]);
  });

  test("builds unique graph edges from reciprocal connections", () => {
    const edges = buildGraphEdges(members);
    const miraEdgeCount = edges.filter(
      (edge) =>
        (edge.sourceId === "dani-park" && edge.targetId === "mira-patel") ||
        (edge.sourceId === "mira-patel" && edge.targetId === "dani-park"),
    );

    expect(miraEdgeCount).toHaveLength(1);
    expect(edges.length).toBeGreaterThan(10);
  });

  test("returns the selected member and their immediate visible connections", () => {
    const visibleMembers = filterMembers(
      members,
      "",
      new Set(["Product"]),
      new Set(["Automation"]),
    );
    const connectionSet = getConnectedMemberIds("priya-sol", visibleMembers);

    expect(connectionSet).toEqual(new Set(["priya-sol", "mira-patel"]));
  });
});
