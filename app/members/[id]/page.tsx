import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MemberProfilePage } from "@/components/member-profile-page";
import { getBuildProvenance } from "@/lib/build-provenance";
import { getMemberById, memberIds } from "@/lib/members";

type MemberPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return memberIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: MemberPageProps): Promise<Metadata> {
  const { id } = await params;
  const member = getMemberById(id);

  if (!member) {
    return {
      title: "Member Not Found | Codex Lab",
      description: "The requested Codex Lab member page does not exist.",
    };
  }

  return {
    title: `${member.name} | Codex Lab`,
    description: member.profile.headline,
  };
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { id } = await params;
  const member = getMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <MemberProfilePage
      buildProvenance={getBuildProvenance()}
      member={member}
    />
  );
}
