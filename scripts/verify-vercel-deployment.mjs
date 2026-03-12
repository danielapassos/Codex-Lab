const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.VERCEL_ENV === "production";
const hasGitMetadata =
  Boolean(process.env.VERCEL_GIT_COMMIT_SHA) &&
  Boolean(process.env.VERCEL_GIT_COMMIT_REF) &&
  Boolean(process.env.VERCEL_GIT_REPO_OWNER) &&
  Boolean(process.env.VERCEL_GIT_REPO_SLUG);

if (isVercel && isProduction && !hasGitMetadata) {
  console.error(
    [
      "Refusing to build an unverified Vercel production deployment.",
      "Production must come from the connected Git repository so the deployed site matches source control.",
      "Push the intended commit to GitHub and let Vercel build from that commit instead of uploading local files.",
    ].join("\n"),
  );

  process.exit(1);
}
