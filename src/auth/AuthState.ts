import * as Teams from "@microsoft/teams-js";
import { Account as MsalAccount } from "msal";
declare global {
  interface Window {
    _authState: AuthState;
  }
}

export interface AuthState {
  isTeams: boolean;
  isAuthenticated: boolean;
  username: string;
  teamsContext: Teams.Context;
  account: MsalAccount;
  token: string;
}
