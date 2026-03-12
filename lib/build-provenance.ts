type BuildEnvironment = Partial<
  Record<
    | "NODE_ENV"
    | "VERCEL"
    | "VERCEL_ENV"
    | "VERCEL_URL"
    | "VERCEL_BRANCH_URL"
    | "VERCEL_DEPLOYMENT_ID"
    | "VERCEL_GIT_COMMIT_SHA"
    | "VERCEL_GIT_COMMIT_REF"
    | "VERCEL_GIT_REPO_OWNER"
    | "VERCEL_GIT_REPO_SLUG"
    | "VERCEL_GIT_PROVIDER",
    string
  >
>;

export type BuildProvenance = {
  branch?: string;
  commitSha?: string;
  deploymentId?: string;
  gitProvider?: string;
  isGitDeployment: boolean;
  isProduction: boolean;
  isVercel: boolean;
  repo?: string;
  shortCommitSha?: string;
  vercelEnv?: string;
  vercelUrl?: string;
  warning?: string;
};

function normalizeValue(value?: string) {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
}

function getShortCommitSha(commitSha?: string) {
  return commitSha ? commitSha.slice(0, 7) : undefined;
}

export function getBuildProvenance(env: BuildEnvironment = process.env): BuildProvenance {
  const isVercel = env.VERCEL === "1";
  const vercelEnv = normalizeValue(env.VERCEL_ENV);
  const branch = normalizeValue(env.VERCEL_GIT_COMMIT_REF);
  const commitSha = normalizeValue(env.VERCEL_GIT_COMMIT_SHA);
  const repoOwner = normalizeValue(env.VERCEL_GIT_REPO_OWNER);
  const repoSlug = normalizeValue(env.VERCEL_GIT_REPO_SLUG);
  const gitProvider = normalizeValue(env.VERCEL_GIT_PROVIDER);
  const deploymentId = normalizeValue(env.VERCEL_DEPLOYMENT_ID);
  const vercelUrl = normalizeValue(env.VERCEL_BRANCH_URL) ?? normalizeValue(env.VERCEL_URL);
  const repo = repoOwner && repoSlug ? `${repoOwner}/${repoSlug}` : undefined;
  const isGitDeployment = Boolean(branch && commitSha && repo && gitProvider);
  const isProduction = vercelEnv === "production";

  return {
    branch,
    commitSha,
    deploymentId,
    gitProvider,
    isGitDeployment,
    isProduction,
    isVercel,
    repo,
    shortCommitSha: getShortCommitSha(commitSha),
    vercelEnv,
    vercelUrl,
    warning:
      isVercel && !isGitDeployment
        ? "Source metadata is unavailable for this deployment."
        : undefined,
  };
}
