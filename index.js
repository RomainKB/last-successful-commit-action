const core = require("@actions/core");
const github = require("@actions/github");

try {
  const octokit = github.getOctokit(core.getInput("github_token"));
  const owner = github.context.repo.owner
  console.log("Owner " + owner);
  const repo = github.context.repo.repo
  console.log("Repo " + repo);
  console.log("workflow_id " + core.getInput("workflow_id"));
  console.log("branch " + core.getInput("branch"));

  octokit.actions
    .listWorkflowRuns({
      owner,
      repo,
      workflow_id: core.getInput("workflow_id"),
      status: "completed",
      branch: core.getInput("branch"),
    })
    .then((res) => {
      console.log("Length " + res.data.workflow_runs.length);
      const lastSuccessCommitHash =
        res.data.workflow_runs.length > 0
          ? res.data.workflow_runs[0].head_commit.id
          : "";
      core.setOutput("commit_hash", lastSuccessCommitHash);
    })
    .catch((e) => {
      core.setFailed(e.message);
    });
} catch (e) {
  core.setFailed(e.message);
}
