import type { BuildProvenance } from "@/lib/build-provenance";

type BuildProvenanceProps = {
  buildProvenance: BuildProvenance;
};

function formatDeploymentLabel(deploymentId?: string) {
  if (!deploymentId) {
    return undefined;
  }

  return deploymentId.replace(/^dpl_/, "");
}

export function BuildProvenancePanel({
  buildProvenance,
}: BuildProvenanceProps) {
  const deploymentLabel = formatDeploymentLabel(buildProvenance.deploymentId);

  return (
    <section
      aria-label="Build provenance"
      className="surface-panel mt-8 rounded-[1.5rem] px-5 py-4"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="micro-label text-[var(--muted)]">Build provenance</p>
          {buildProvenance.isGitDeployment ? (
            <p className="text-sm leading-6 text-[var(--text)]">
              This build is traced to{" "}
              <span className="font-medium">{buildProvenance.repo}</span> on{" "}
              <span className="font-medium">{buildProvenance.branch}</span> at commit{" "}
              <code>{buildProvenance.shortCommitSha}</code>.
            </p>
          ) : (
            <p className="text-sm leading-6 text-[var(--text)]">
              This build does not expose Git source metadata.
            </p>
          )}
        </div>

        <div className="text-xs leading-5 text-[var(--muted)] md:text-right">
          {buildProvenance.isVercel ? (
            <>
              <p>
                Environment: {buildProvenance.vercelEnv ?? "unknown"}
                {deploymentLabel ? ` · ${deploymentLabel}` : ""}
              </p>
              {buildProvenance.vercelUrl ? <p>{buildProvenance.vercelUrl}</p> : null}
            </>
          ) : (
            <p>Environment: local workspace</p>
          )}
        </div>
      </div>

      {buildProvenance.warning ? (
        <p className="mt-3 rounded-[1rem] border border-[var(--border-strong)] bg-[var(--panel-soft)] px-3 py-2 text-xs leading-5 text-[var(--text)]">
          {buildProvenance.warning} Production deploys are blocked unless Vercel
          can prove which Git commit they came from.
        </p>
      ) : null}
    </section>
  );
}
