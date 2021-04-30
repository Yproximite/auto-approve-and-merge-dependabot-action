const core = require('@actions/core');
const { parseUpdateType, isUpdateTypeAllowed } = require('./update-type');
const { context, getOctokit } = require('@actions/github');

async function main() {
  const token = core.getInput('github-token', { required: true });
  const updateType = core.getInput('update-type');

  if (context.eventName !== 'pull_request') {
    core.error('Not detected as a pull request, skipping.');
    return;
  }

  const github = getOctokit(token, {
    log: console,
  });

  core.info('Getting pull request...');
  const { data: pr } = await github.issues.get({
    ...context.repo,
    issue_number: context.payload.pull_request.number,
  });

  if (!['dependabot[bot]', 'dependabot-preview[bot]'].includes(pr.user.login)) {
    core.error('Pull request is not from Dependabot, skipping.');
    return;
  }

  if (updateType === 'all') {
    core.info('All updates ');
  } else {
    const actualUpdateType = parseUpdateType(pr.body);
    core.info(`Detected update type "${actualUpdateType}".`);

    if (isUpdateTypeAllowed(updateType, actualUpdateType)) {
      core.info('The update type is allowed!');
    } else {
      core.error('The update type is NOT allowed, skipping.');
      return;
    }
  }

  core.info(`Approving pull request #${pr.number}"...`);
  await github.pulls.createReview({
    ...context.repo,
    pull_number: pr.number,
    event: 'APPROVE',
  });
  core.info(`Approved pull request #${pr.number}"!`);

  core.info(`Merging pull request "#${pr.number}"...`);
  await github.pulls.merge({
    ...context.repo,
    pull_number: pr.number,
  });
  core.info(`Merged pull request "#${pr.number}"!`);
}

process.on('unhandledRejection', handleError);
main().catch(handleError);

function handleError(err) {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
