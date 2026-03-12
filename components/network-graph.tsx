"use client";

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
} from "d3-force";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import { AvatarBadge } from "@/components/avatar-badge";
import { buildGraphEdges } from "@/lib/directory";
import type { Member } from "@/lib/members";

type NetworkGraphProps = {
  members: Member[];
  selectedId: string | null;
  hoveredId: string | null;
  connectedIds: Set<string>;
  onSelect: (memberId: string | null) => void;
  onHover: (memberId: string | null) => void;
};

type GraphNode = {
  id: string;
  member: Member;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
};

type ForceLink = SimulationLinkDatum<GraphNode> & {
  id: string;
};

type RenderNode = {
  id: string;
  member: Member;
  x: number;
  y: number;
};

type RenderLink = {
  id: string;
  sourceId: string;
  targetId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

type GraphState = {
  nodes: RenderNode[];
  links: RenderLink[];
};

type DragState = {
  memberId: string;
  originX: number;
  originY: number;
  moved: boolean;
};

type PanState = {
  originPointerX: number;
  originPointerY: number;
  originX: number;
  originY: number;
  moved: boolean;
};

const INITIAL_LAYOUT_TICKS = 120;
const DRAG_SETTLE_TICKS = 28;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function createSnapshot(nodes: GraphNode[], links: ForceLink[]): GraphState {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      member: node.member,
      x: node.x,
      y: node.y,
    })),
    links: links.flatMap((link) => {
      if (
        typeof link.source !== "object" ||
        link.source === null ||
        typeof link.target !== "object" ||
        link.target === null
      ) {
        return [];
      }

      return [
        {
          id: link.id,
          sourceId: link.source.id,
          targetId: link.target.id,
          x1: link.source.x,
          y1: link.source.y,
          x2: link.target.x,
          y2: link.target.y,
        },
      ];
    }),
  };
}

function createInitialNode(
  member: Member,
  index: number,
  count: number,
  width: number,
  height: number,
  previousNode?: GraphNode,
): GraphNode {
  if (previousNode) {
    return {
      id: member.id,
      member,
      x: clamp(previousNode.x, 0, width),
      y: clamp(previousNode.y, 0, height),
      vx: 0,
      vy: 0,
    };
  }

  const angle = count === 1 ? Math.PI / 2 : (Math.PI * 2 * index) / count - Math.PI / 2;
  const radius = Math.min(width, height) * 0.3;

  return {
    id: member.id,
    member,
    x: width / 2 + Math.cos(angle) * radius,
    y: height / 2 + Math.sin(angle) * radius,
  };
}

export function NetworkGraph({
  members,
  selectedId,
  hoveredId,
  connectedIds,
  onSelect,
  onHover,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<ForceLink[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const panStateRef = useRef<PanState | null>(null);
  const viewportRef = useRef<Viewport>({ x: 0, y: 0, scale: 1 });

  const [graphState, setGraphState] = useState<GraphState>({ nodes: [], links: [] });
  const [size, setSize] = useState({ width: 640, height: 480 });
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });

  function commitViewport(nextViewport: Viewport) {
    viewportRef.current = nextViewport;
    setViewport(nextViewport);
  }

  function scheduleSnapshot() {
    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      setGraphState(createSnapshot(nodesRef.current, linksRef.current));
    });
  }

  const commitSnapshot = useEffectEvent(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setGraphState(createSnapshot(nodesRef.current, linksRef.current));
  });

  const settleGraph = useEffectEvent((iterations: number) => {
    const simulation = simulationRef.current;

    if (!simulation) {
      return;
    }

    simulation.stop();

    for (let iteration = 0; iteration < iterations; iteration += 1) {
      simulation.tick();
    }

    commitSnapshot();
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth || 640;
      const nextHeight = container.clientHeight || 480;

      setSize({
        width: nextWidth,
        height: nextHeight,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) {
      return;
    }

    const sortedMembers = [...members].sort((left, right) => left.id.localeCompare(right.id));
    const previousNodes = new Map(nodesRef.current.map((node) => [node.id, node]));
    const nodes = sortedMembers.map((member, index) =>
      createInitialNode(
        member,
        index,
        sortedMembers.length,
        size.width,
        size.height,
        previousNodes.get(member.id),
      ),
    );
    const edgeList = buildGraphEdges(sortedMembers);
    const links = edgeList.map((edge) => ({
      id: `${edge.sourceId}:${edge.targetId}`,
      source: edge.sourceId,
      target: edge.targetId,
    }));

    simulationRef.current?.stop();
    nodesRef.current = nodes;
    linksRef.current = links;

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<GraphNode, ForceLink>(links)
          .id((node) => node.id)
          .distance(118)
          .strength(0.76),
      )
      .force("charge", forceManyBody().strength(-190))
      .force("collision", forceCollide(54).strength(1))
      .force("center", forceCenter(size.width / 2, size.height / 2))
      .force("x", forceX(size.width / 2).strength(0.08))
      .force("y", forceY(size.height / 2).strength(0.08))
      .alpha(0.72)
      .alphaDecay(0.16)
      .velocityDecay(0.4)
      .stop();

    simulation.on("tick", () => {
      scheduleSnapshot();
    });

    simulationRef.current = simulation;
    settleGraph(INITIAL_LAYOUT_TICKS);

    return () => {
      simulation.stop();
    };
  }, [members, size.height, size.width]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (dragStateRef.current) {
        const container = containerRef.current;
        const simulation = simulationRef.current;

        if (!container || !simulation) {
          return;
        }

        const activeNode = nodesRef.current.find(
          (node) => node.id === dragStateRef.current?.memberId,
        );

        if (!activeNode) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const relativeX =
          (event.clientX - rect.left - viewportRef.current.x) / viewportRef.current.scale;
        const relativeY =
          (event.clientY - rect.top - viewportRef.current.y) / viewportRef.current.scale;

        dragStateRef.current.moved =
          dragStateRef.current.moved ||
          Math.abs(event.clientX - dragStateRef.current.originX) > 4 ||
          Math.abs(event.clientY - dragStateRef.current.originY) > 4;

        activeNode.fx = relativeX;
        activeNode.fy = relativeY;
        activeNode.x = relativeX;
        activeNode.y = relativeY;

        simulation.alpha(Math.max(simulation.alpha(), 0.1)).restart();
        scheduleSnapshot();
      }

      if (panStateRef.current) {
        const deltaX = event.clientX - panStateRef.current.originPointerX;
        const deltaY = event.clientY - panStateRef.current.originPointerY;
        const nextViewport = {
          x: panStateRef.current.originX + deltaX,
          y: panStateRef.current.originY + deltaY,
          scale: viewportRef.current.scale,
        };

        panStateRef.current.moved =
          panStateRef.current.moved || Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;

        commitViewport(nextViewport);
      }
    }

    function handlePointerUp() {
      if (dragStateRef.current) {
        const activeNode = nodesRef.current.find(
          (node) => node.id === dragStateRef.current?.memberId,
        );

        if (activeNode) {
          activeNode.fx = null;
          activeNode.fy = null;
          const simulation = simulationRef.current;

          if (simulation) {
            simulation.alpha(0.14);
            settleGraph(DRAG_SETTLE_TICKS);
          }
        }

        if (!dragStateRef.current.moved) {
          onSelect(selectedId === dragStateRef.current.memberId ? null : dragStateRef.current.memberId);
        }

        dragStateRef.current = null;
      }

      if (panStateRef.current) {
        if (!panStateRef.current.moved) {
          onSelect(null);
        }

        panStateRef.current = null;
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onSelect, selectedId]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  function handleBackgroundPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-graph-node='true']")) {
      return;
    }

    panStateRef.current = {
      originPointerX: event.clientX,
      originPointerY: event.clientY,
      originX: viewportRef.current.x,
      originY: viewportRef.current.y,
      moved: false,
    };
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const nextScale = clamp(
      viewportRef.current.scale * (event.deltaY > 0 ? 0.92 : 1.08),
      0.68,
      1.9,
    );
    const nextViewport = {
      scale: nextScale,
      x:
        pointerX -
        ((pointerX - viewportRef.current.x) / viewportRef.current.scale) * nextScale,
      y:
        pointerY -
        ((pointerY - viewportRef.current.y) / viewportRef.current.scale) * nextScale,
    };

    commitViewport(nextViewport);
  }

  function handleNodePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
    memberId: string,
  ) {
    event.stopPropagation();

    dragStateRef.current = {
      memberId,
      originX: event.clientX,
      originY: event.clientY,
      moved: false,
    };
  }

  const svgTransform = `translate(${viewport.x} ${viewport.y}) scale(${viewport.scale})`;
  const htmlTransform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`;

  return (
    <section aria-label="Student network graph" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="micro-label text-[var(--muted)]">Graph</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text)]">
            Student map
          </h3>
        </div>
        <p className="max-w-[14rem] text-right text-[0.76rem] leading-5 text-[var(--muted)]">
          Shared schools and public profile overlap shape the links.
        </p>
      </div>

      <div
        ref={containerRef}
        className="surface-panel relative h-[22rem] overflow-hidden rounded-[1.75rem] border border-[var(--border)] sm:h-[24rem] lg:h-[28rem] xl:h-[30rem]"
        onPointerDown={handleBackgroundPointerDown}
        onWheel={handleWheel}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,128,255,0.12),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(24,24,24,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,24,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

        {graphState.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[var(--muted)]">
            No students are available for the graph yet.
          </div>
        ) : null}

        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g transform={svgTransform}>
            {graphState.links.map((link) => {
              const isActive =
                selectedId !== null &&
                (link.sourceId === selectedId || link.targetId === selectedId);

              return (
                <line
                  key={link.id}
                  x1={link.x1}
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke={isActive ? "rgba(37,128,255,0.72)" : "rgba(37,128,255,0.18)"}
                  strokeWidth={isActive ? 2.2 : 1.1}
                />
              );
            })}
          </g>
        </svg>

        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: htmlTransform, transformOrigin: "0 0" }}
        >
          {graphState.nodes.map((node) => {
            const isSelected = node.id === selectedId;
            const isHovered = node.id === hoveredId;
            const isActive = !isSelected && connectedIds.has(node.id);

            return (
              <button
                key={node.id}
                type="button"
                data-graph-node="true"
                aria-label={`Focus ${node.member.name}`}
                aria-pressed={isSelected}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-shadow ${
                  isSelected
                    ? "z-20 shadow-[0_0_0_1px_rgba(37,128,255,0.45),0_0_42px_rgba(176,109,255,0.24)]"
                    : isHovered
                      ? "z-10 shadow-[0_0_0_1px_rgba(37,128,255,0.34),0_0_28px_rgba(37,128,255,0.18)]"
                    : isActive
                      ? "z-10 shadow-[0_0_0_1px_rgba(37,128,255,0.26),0_0_28px_rgba(37,128,255,0.18)]"
                      : "shadow-none"
                }`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onPointerDown={(event) => handleNodePointerDown(event, node.id)}
                onMouseEnter={() => onHover(node.id)}
                onMouseLeave={() => onHover(null)}
              >
                <span className="block rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.88)] px-2 py-2 backdrop-blur-md">
                  <span className="flex items-center gap-2">
                    <AvatarBadge member={node.member} size="sm" />
                    <span className="hidden max-w-[10rem] text-left text-xs font-medium leading-tight text-[var(--text)] sm:block">
                      {node.member.name}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
