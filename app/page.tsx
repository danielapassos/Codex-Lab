import { getBuildProvenance } from "@/lib/build-provenance";
import { DirectoryHome } from "@/components/directory-home";
import { members } from "@/lib/members";

export default function Home() {
  return (
    <DirectoryHome
      initialMembers={members}
      buildProvenance={getBuildProvenance()}
    />
  );
}
