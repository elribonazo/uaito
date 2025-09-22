import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    try {
      if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
      }

      const owner = process.env.GITHUB_OWNER;
      const repo = process.env.GITHUB_REPO;
      const githubToken = process.env.GITHUB_PAT;
      const version = req.query.version as string;

      if (!owner || !repo || !githubToken) {
        return res.status(500).json({ message: 'Missing required environment variables' });
      }

      const octokit = new Octokit({ auth: githubToken });

      try {
        const { data: release } = await octokit.repos.getLatestRelease({
          owner,
          repo,
        });

        const asset = release.assets.find((asset) => asset.name.includes(version))
        if (asset) {
          try {
            const response = await fetch(asset.url, {
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: 'application/octet-stream'
              }
            });
            if (!response.ok) {
              throw new Error(`Failed to fetch asset: ${response.statusText}`);
            }

            if (!response.body) { 
              throw new Error('Response body is empty.');
            }

            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=${asset.name}`);
            res.setHeader('Content-Length', asset.size);

            response.body.pipe(res);
          } catch (fetchError) {
            console.error('Error fetching asset:', fetchError);
            res.status(500).json({ message: 'Error downloading GitHub release asset' });
          }
        } else {
          res.status(404).json({ message: 'GitHub release asset not found' });
        }
      } catch (error) {
        console.error('Error fetching latest GitHub release:', error);
        res.status(500).json({ message: 'Error fetching latest GitHub release' });
      }
    } catch (error) {
      console.error('Unexpected error in GitHub release asset download handler:', error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }