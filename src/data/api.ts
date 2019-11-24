import { getToken } from "../auth/hybridAuth";
import { cachify } from "../utils/cache";

export async function _request(token, url, method = "GET", body = null) {
  let requestOptions: RequestInit = {
    method,
    redirect: "follow",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  if (body) {
    requestOptions.body = body;
  }
  return fetch(url, requestOptions).then(async function(response) {
    if (response.ok) {
      return response.json();
    } else {
      let error = await response.text();
      console.error("fetch error: " + response.status, error);
      throw error;
    }
  });
}

export async function devOpsRequest(path, method = "GET", body = null) {
  let token = await getToken();
  if (!token) return null;
  console.log("DEVEOPS TOKEN", token);
  let url = "https://skyline.visualstudio.com" + path;

  return _request(token, url, method, body);
}
export async function fetchRepositories(projectName: string) {
  try {
    let path = `/${projectName}/_apis/git/repositories`;
    let data = await devOpsRequest(path);
    if (!data || !data.value) return [];

    let repos: VSTSGitRepo[] = data.value
      .map((raw) => ({
        id: raw.id,
        name: raw.name,
        webUrl: raw.webUrl,
      }))
      .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

    return repos;
  } catch (err) {
    return [];
  }
}

export const getRepositories = fetchRepositories;

export async function fetchProjects(): Promise<VSTSProject[]> {
  let data = await devOpsRequest("/_apis/projects?$top=10000");
  return data ? data.value : null;
}

// export const getProjects = cachify(fetchProjects, {
//   key: "devops-projects-results",
// });

export const getProjects = fetchProjects;

const PINNED_CACHE_KEY = "devops-project-pinned";
export const getPinnedProjecs = function(): string[] {
  try {
    let cachedStr = localStorage.getItem(PINNED_CACHE_KEY);
    if (cachedStr) {
      return JSON.parse(cachedStr).sort();
    }
  } catch (err) {}
  return [];
};

export const togglePin = (projectName: string) => {
  let pinnedProjects = getPinnedProjecs();
  let exists = pinnedProjects.find((p) => p === projectName);
  if (exists) {
    pinnedProjects = pinnedProjects.filter((p) => p !== projectName);
  } else {
    pinnedProjects.push(projectName);
  }
  localStorage.setItem(PINNED_CACHE_KEY, JSON.stringify(pinnedProjects));
  return getPinnedProjecs();
};

export interface VSTSProject {
  id: string;
  name: string;
  url: string;
}

export interface VSTSGitRepo {
  name: string;
  id: string;
  webUrl: string;
}
