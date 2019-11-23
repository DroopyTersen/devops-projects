import { format, addDays, addHours, compareAsc, isBefore } from "date-fns";
import { getToken } from "../auth/hybridAuth";
import { cachify } from "../utils/cache";
const GRAPH_BASE_URL = "https://graph.microsoft.com";

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

// export async function graphRequest(path, method = "GET", body = null) {
//   let token = await acquireGraphToken();
//   let url = GRAPH_BASE_URL + path;

//   return _request(token, url, method, body);
// }

export async function devOpsRequest(path, method = "GET", body = null) {
  let token = await getToken();
  if (!token) return null;
  console.log("DEVEOPS TOKEN", token);
  let url = "https://skyline.visualstudio.com/_apis" + path;

  return _request(token, url, method, body);
}

export async function fetchProjects(): Promise<VSTSProject[]> {
  let data = await devOpsRequest("/projects?$top=10000");
  return data ? data.value : null;
}

export const getProjects = cachify(fetchProjects, {
  key: "devops-projects-results",
});

export interface VSTSProject {
  id: string;
  name: string;
  url: string;
}
