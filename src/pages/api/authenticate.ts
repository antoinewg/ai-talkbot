import { DeepgramError, createClient } from "@deepgram/sdk";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // exit early so we don't request keys while in devmode
  if (process.env.DEEPGRAM_ENV === "development") {
    return res.json({
      key: process.env.DEEPGRAM_API_KEY ?? "",
    });
  }

  // use the request object to invalidate the cache every request
  const url = req.url;
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY ?? "");

  const { result: projectsResult, error: projectsError } =
    await deepgram.manage.getProjects();

  if (projectsError) {
    return res.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return res.json(
      new DeepgramError(
        "Cannot find a Deepgram project. Please create a project first."
      )
    );
  }

  const { result: newKeyResult, error: newKeyError } =
    await deepgram.manage.createProjectKey(project.project_id, {
      comment: "Temporary API key",
      scopes: ["usage:write"],
      tags: ["next.js"],
      time_to_live_in_seconds: 60,
    });

  if (newKeyError) {
    return res.json(newKeyError);
  }

  res.setHeader("Surrogate-Control", "no-store");
  res.setHeader(
    "Cache-Control",
    "s-maxage=0, no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Expires", "0");

  return res.json({ ...newKeyResult, url });
}