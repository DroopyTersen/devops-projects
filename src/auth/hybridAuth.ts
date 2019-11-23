import * as Teams from "@microsoft/teams-js";
import { msalInstance, acquireToken } from "./msalAuth";
import cache from "../utils/cache";
import { AuthState } from "./AuthState";
import { authenticate as msalAuthenticate } from "./msalAuth";

Teams.initialize();

window._authState = {
  get isAuthenticated() {
    return !!window._authState.account;
  },
  get isTeams() {
    return !!window._authState.teamsContext;
  },
  username: "",
  teamsContext: null,
  account: null,
  token: "",
};

export const getAuthState = () => window._authState;

export const getToken = async () => {
  if (!window._authState.isTeams) {
    return acquireToken();
  } else {
    // it is Teams context
    let authState = tryGetCachedAuthState();
    if (!authState) {
      authState = await authenticate();
    }
    return authState && authState.token ? authState.token : null;
  }
};

export const authenticate = async (): Promise<AuthState> => {
  // NOT IN TEAMS
  if (!window._authState.isTeams) {
    let { account, token } = await msalAuthenticate();
    console.log("TCL: authenticate -> msalAuthenticate", account, token);
    window._authState.account = account;
    window._authState.token = token;
    cacheAuthState(window._authState);
    return window._authState;
  }

  // INSIDE TEAMS
  return new Promise((resolve, reject) => {
    Teams.authentication.authenticate({
      url: window.location.origin + "/teams-signin",
      width: 600,
      height: 535,
      successCallback: function({ account, token }: any) {
        console.log("TCL: AuthenticateScreen -> successCallback", account, token);
        window._authState.account = account;
        window._authState.token = token;
        cacheAuthState(window._authState);
        resolve(window._authState);
      },
      failureCallback: function(reason) {
        console.log("AUTH ERROR", reason);
      },
    });
  });
};
export const initAuth = async function() {
  let teamsContext = await tryGetTeamsContext();
  if (teamsContext) {
    window._authState.teamsContext = teamsContext;
    let cachedState = tryGetCachedAuthState(teamsContext.userPrincipalName);
    if (cachedState) {
      window._authState = {
        ...cachedState,
        teamsContext,
      };
    }
  } else {
    window._authState.account = msalInstance.getAccount();
  }
  return window._authState;
};

export const tryGetTeamsContext = function(): Promise<Teams.Context> {
  return new Promise((resolve, reject) => {
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) resolve(null);
    }, 300);
    Teams.getContext((context) => {
      isResolved = true;
      if (context) {
        resolve(context);
      } else {
        resolve(null);
      }
    });
  });
};

const AUTH_CACHE_KEY = "devops-projects-auth";
const AUTH_CACHE_DURATION = 1000 * 60 * 58;
export const tryGetCachedAuthState = function(username = "") {
  let authState: AuthState = cache.get(AUTH_CACHE_KEY);
  if (!username) return authState;

  return authState &&
    authState.teamsContext &&
    authState.teamsContext.userPrincipalName === username
    ? authState
    : null;
};

export const cacheAuthState = function(authState: AuthState) {
  cache.set({ key: AUTH_CACHE_KEY, duration: AUTH_CACHE_DURATION }, authState);
  return authState;
};
