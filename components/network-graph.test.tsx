import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { NetworkGraph } from "@/components/network-graph";
import { members } from "@/lib/members";

class ResizeObserverMock {
  observe() {}

  disconnect() {}
}

describe("NetworkGraph", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test("renders the initial graph even if requestAnimationFrame is delayed", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    render(
      <NetworkGraph
        members={members}
        selectedId={null}
        hoveredId={null}
        connectedIds={new Set<string>()}
        onSelect={() => {}}
        onHover={() => {}}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("No students are available for the graph yet.")).not.toBeInTheDocument();
      expect(document.querySelectorAll("[data-graph-node='true']")).toHaveLength(members.length);
    });
  });
});
