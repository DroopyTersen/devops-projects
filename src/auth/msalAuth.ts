import { UserAgentApplication } from "msal";

export const msalConfig = {
  authority: "https://login.microsoftonline.com/common",
  clientId: "cc4da238-8402-4759-8622-c730b912d313",
};

export const msalInstance = new UserAgentApplication({
  auth: {
    clientId: msalConfig.clientId,
    authority: msalConfig.authority,
  },
  cache: {
    cacheLocation: "localStorage",
  },
});

export const authenticate = async function() {
  let { isAuthenticated } = await _authenticate();
  let result = {
    token: "",
    account: null,
    isAuthenticated,
  };
  if (isAuthenticated) {
    result.account = msalInstance.getAccount();
    result.token = await acquireToken();
  }
  return result;
};

export async function acquireToken() {
  let scopes = ["499b84ac-1321-427f-aa17-267ca6975798/user_impersonation"];
  return _acquireToken(scopes);
}

const _authenticate = async function(): Promise<any> {
  return new Promise((resolve, reject) => {
    msalInstance.handleRedirectCallback(
      () => {
        resolve({ isAuthenticated: true });
      },
      (err, accountState) => {
        console.log("_authenticate.Callback Error");
        reject({ err, accountState, isAuthenticated: false });
      }
    );

    if (msalInstance.isCallback(window.location.hash)) {
      return { isAuthenticated: false, renewIframe: true };
    }

    if (!msalInstance.getAccount()) {
      msalInstance.loginRedirect();
      return;
    } else {
      resolve({ isAuthenticated: true });
    }
  });
};

export async function _acquireToken(scopes: string[]) {
  let tokenRequest = { scopes };

  let tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest).catch((error) => {
    return msalInstance.acquireTokenRedirect(tokenRequest);
  });

  return tokenResponse ? tokenResponse.accessToken : "";
}

// export async function acquireGraphToken() {
//   return _acquireToken(["openid", "profile", "User.Read", "Calendars.ReadWrite"]);
// }
