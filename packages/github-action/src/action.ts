import * as core from '@actions/core';
import * as github from '@actions/github';
import { GithubAgent } from './agent';
import { LLMProvider, MessageArray, Message, ToolResultBlock } from '@uaito/sdk';

export async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const allowedUser = core.getInput('allowed-user', { required: true });
    const llmProvider = core.getInput('llm-provider', { required: true }) as LLMProvider;
    const llmApiKey = core.getInput('llm-api-key', { required: true });
    const model = core.getInput('model');

    const octokit = github.getOctokit(token);
    const { context } = github;

    if (context.eventName !== 'issues' || context.payload.action !== 'opened') {
      core.info('Action triggered by an event other than a new issue, skipping.');
      return;
    }

    const issue = context.payload.issue;
    if (!issue) {
      core.setFailed('No issue found in the event payload.');
      return;
    }

    const issueAuthor = issue.user.login;
    core.info(`Issue opened by: ${issueAuthor}`);

    if (issueAuthor !== allowedUser) {
      core.info(`Issue author "${issueAuthor}" is not the allowed user "${allowedUser}", skipping.`);
      return;
    }

    core.info(`Processing issue #${issue.number} by ${issueAuthor}`);

    const issueContent = issue.body || '';

    // Here I will integrate with the AI agent.
    const agent = await GithubAgent.create(
      llmProvider,
      {
        apiKey: llmApiKey,
        model: model,
        onTool: async (message: Message) => {
          core.info(`Tool call received: ${JSON.stringify(message)}`);
          const toolCall = message.content.find((c) => c.type === 'tool_use');
          if (!toolCall) return;

          let toolResult: any;
          try {
            switch (toolCall.name) {
              case 'seeIssues': {
                toolResult = await octokit.rest.issues.listForRepo({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                });
                break;
              }
              case 'createIssue': {
                toolResult = await octokit.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: (toolCall.input as any).title,
                  body: (toolCall.input as any).body,
                });
                break;
              }
              case 'replyToComment': {
                toolResult = await octokit.rest.issues.createComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: (toolCall.input as any).issue_number,
                  body: (toolCall.input as any).body,
                });
                break;
              }
              case 'createBranch': {
                toolResult = await octokit.rest.git.createRef({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  ref: `refs/heads/${(toolCall.input as any).branch}`,
                  sha: (toolCall.input as any).sha,
                });
                break;
              }
              case 'createAndPushCode': {
                const { owner, repo } = context.repo;
                const { branch, files, commit_message } = toolCall.input as any;

                const branchRef = await octokit.rest.git.getRef({
                  owner,
                  repo,
                  ref: `heads/${branch}`,
                });
                const latestCommitSha = branchRef.data.object.sha;

                const tree = await octokit.rest.git.createTree({
                  owner,
                  repo,
                  base_tree: latestCommitSha,
                  tree: files.map((file: { path: string; content: string }) => ({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    content: file.content,
                  })),
                });

                const commit = await octokit.rest.git.createCommit({
                  owner,
                  repo,
                  message: commit_message,
                  tree: tree.data.sha,
                  parents: [latestCommitSha],
                });

                toolResult = await octokit.rest.git.updateRef({
                  owner,
                  repo,
                  ref: `heads/${branch}`,
                  sha: commit.data.sha,
                });
                break;
              }
              case 'createPullRequest': {
                toolResult = await octokit.rest.pulls.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: (toolCall.input as any).title,
                  head: (toolCall.input as any).head,
                  base: (toolCall.input as any).base,
                  body: (toolCall.input as any).body,
                });
                break;
              }
              case 'mergePullRequest': {
                toolResult = await octokit.rest.pulls.merge({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  pull_number: (toolCall.input as any).pull_number,
                });
                break;
              }
              default:
                throw new Error(`Tool ${toolCall.name} not implemented.`);
            }

            const toolResultBlock: ToolResultBlock = {
              type: 'tool_result',
              tool_use_id: toolCall.id,
              name:toolCall.name,
              content: [{ type: 'text', text: JSON.stringify(toolResult) }],
            };
            agent.inputs.push({
              role: 'user',
              content: [toolResultBlock],
            });

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            const toolResultBlock: ToolResultBlock = {
              type: 'tool_result',
              tool_use_id: toolCall.id,
              name: toolCall.name,
              content: [{ type: 'text', text: `Error: ${errorMessage}` }],
              isError: true,
            };
            agent.inputs.push({
              role: 'user',
              content: [toolResultBlock],
            });
          }
        }
      } as any,
      new MessageArray([])
    );
    
    const { response } = await agent.performTask(issueContent);

    let responseText = '';
    for await (const chunk of response) {
      if (chunk.type === 'message' && chunk.content[0]?.type === 'text') {
        responseText += chunk.content[0].text;
      }
    }
    
    // For now, just add a comment with the agent's response.
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issue.number,
      body: `Hello @${issueAuthor}! I've received your issue. Here is my analysis:\n\n${responseText}`
    });

    core.info('Comment posted to the issue.');

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();
