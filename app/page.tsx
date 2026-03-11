import { DirectoryHome } from "@/components/directory-home";
import { getJoinFormConfig } from "@/lib/config";
import { members } from "@/lib/members";

export default function Home() {
  const joinForm = getJoinFormConfig();

  return (
    <DirectoryHome
      initialMembers={members}
      joinFormUrl={joinForm.url}
      usingPlaceholderJoinForm={joinForm.isPlaceholder}
    />
  );
}
