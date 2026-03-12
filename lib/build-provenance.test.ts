import { describe, expect, it } from "vitest";

import { getBuildProvenance } from "@/lib/build-provenance";

describe("getBuildProvenance", () => {
  it("extracts git-backed Vercel deployment metadata", () => {
    const buildProvenance = getBuildProvenance({
      VERCEL: "1",
      VERCEL_DEPLOYMENT_ID: "dpl_12345",
      VERCEL_ENV: "production",
      VERCEL_GIT_COMMIT_REF: "main",
      VERCEL_GIT_COMMIT_SHA: "f1699c91e5885b144534c28c7a64aacd06bd6c66",
      VERCEL_GIT_PROVIDER: "github",
      VERCEL_GIT_REPO_OWNER: "danielapassos",
      VERCEL_GIT_REPO_SLUG: "Codex-Lab",
      VERCEL_URL: "codex-lab-seven.vercel.app",
    });

    expect(buildProvenance.isGitDeployment).toBe(true);
    expect(buildProvenance.repo).toBe("danielapassos/Codex-Lab");
    expect(buildProvenance.branch).toBe("main");
    expect(buildProvenance.shortCommitSha).toBe("f1699c9");
    expect(buildProvenance.warning).toBeUndefined();
  });

  it("flags Vercel deployments that do not expose git metadata", () => {
    const buildProvenance = getBuildProvenance({
      VERCEL: "1",
      VERCEL_ENV: "production",
      VERCEL_URL: "codex-lab-seven.vercel.app",
    });

    expect(buildProvenance.isGitDeployment).toBe(false);
    expect(buildProvenance.warning).toContain("Source metadata is unavailable");
  });
});
