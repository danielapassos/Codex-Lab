import type { Member } from "@/lib/members";

export type GraphEdge = {
  sourceId: string;
  targetId: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getFilterOptions(members: Member[]) {
  const disciplines = Array.from(
    new Set(members.flatMap((member) => member.disciplines)),
  ).sort((left, right) => left.localeCompare(right));
  const domains = Array.from(new Set(members.flatMap((member) => member.domains))).sort(
    (left, right) => left.localeCompare(right),
  );

  return { disciplines, domains };
}

export function filterMembers(
  members: Member[],
  query: string,
  disciplineFilters: Set<string>,
  domainFilters: Set<string>,
) {
  const normalizedQuery = normalize(query);

  return members.filter((member) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        member.name,
        member.focus,
        member.website ?? "",
        member.disciplines.join(" "),
        member.domains.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesDisciplines =
      disciplineFilters.size === 0 ||
      member.disciplines.some((discipline) => disciplineFilters.has(discipline));
    const matchesDomains =
      domainFilters.size === 0 ||
      member.domains.some((domain) => domainFilters.has(domain));

    return matchesQuery && matchesDisciplines && matchesDomains;
  });
}

export function buildGraphEdges(members: Member[]) {
  const memberIds = new Set(members.map((member) => member.id));
  const seenEdges = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const member of members) {
    for (const connectionId of member.connections) {
      if (!memberIds.has(connectionId) || connectionId === member.id) {
        continue;
      }

      const sourceId = member.id < connectionId ? member.id : connectionId;
      const targetId = member.id < connectionId ? connectionId : member.id;
      const edgeId = `${sourceId}:${targetId}`;

      if (seenEdges.has(edgeId)) {
        continue;
      }

      seenEdges.add(edgeId);
      edges.push({ sourceId, targetId });
    }
  }

  return edges;
}

export function getConnectedMemberIds(memberId: string | null, members: Member[]) {
  if (!memberId) {
    return new Set<string>();
  }

  const edges = buildGraphEdges(members);
  const connectedIds = new Set<string>([memberId]);

  for (const edge of edges) {
    if (edge.sourceId === memberId) {
      connectedIds.add(edge.targetId);
    }

    if (edge.targetId === memberId) {
      connectedIds.add(edge.sourceId);
    }
  }

  return connectedIds;
}

export function formatWebsiteLabel(website?: string) {
  if (!website) {
    return "";
  }

  try {
    const normalizedWebsite = website.startsWith("http") ? website : `https://${website}`;
    const { host, pathname } = new URL(normalizedWebsite);
    const trimmedHost = host.replace(/^www\./, "");
    const trimmedPath = pathname === "/" ? "" : pathname.replace(/\/$/, "");

    return `${trimmedHost}${trimmedPath}`;
  } catch {
    return website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarTone(memberId: string) {
  const tones = [
    "from-teal-300/70 via-emerald-300/55 to-cyan-300/60",
    "from-sky-300/70 via-blue-300/55 to-indigo-300/55",
    "from-lime-300/70 via-emerald-300/50 to-teal-300/60",
    "from-amber-300/70 via-orange-300/50 to-rose-300/55",
    "from-fuchsia-300/60 via-violet-300/45 to-sky-300/55",
  ];
  const seed = memberId.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return tones[seed % tones.length];
}
