import { getInput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";

const fs = require('fs').promises;

async function example(filePath: string) {
  try {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export async function run() {
  const token = getInput("gh-token");
  const label = getInput("label");

  const octokit = getOctokit(token);
  const pullRequest = context.payload.pull_request;

  try {
    if (!pullRequest) {
      throw new Error("This action can only be run on Pull Requests");
    }

    await octokit.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pullRequest.number,
      labels: [label],
    });

    await example(getInput("files").split(' ')[0]);

  } catch (error) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}
