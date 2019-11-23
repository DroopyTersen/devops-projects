import React, { useContext, useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { Provider as FluentThemeProvider, themes, ThemePrepared } from "@stardust-ui/react";
import CurrentUserProvider from "./CurrentUserProvider";
import { getAuthState } from "../auth/hybridAuth";

microsoftTeams.initialize();

export default function TeamsAppProvider({ children }) {
  let { teamsContext } = getAuthState();
  console.log("TCL: TeamsAppProvider -> teamsContext", teamsContext);

  return (
    <FluentThemeProvider className="teams-app" theme={getFluentTheme(teamsContext)}>
      {children}
    </FluentThemeProvider>
  );
}

export const TeamsContext = React.createContext<microsoftTeams.Context>(null);

const THEME_CACHE_KEY = "devops-project-ms-teams-theme";

export const getFluentTheme = function(teamsContext?: microsoftTeams.Context): ThemePrepared {
  // Do we have a context? if so use theme from there.
  let themeKey = localStorage.getItem(THEME_CACHE_KEY) || "default";
  if (teamsContext && teamsContext.theme) {
    localStorage.setItem(THEME_CACHE_KEY, teamsContext.theme);
    themeKey = teamsContext.theme;
  }

  try {
    return themeMapper[themeKey];
  } catch (err) {
    return themes.teams;
  }
};

let themeMapper = {
  dark: themes.teamsDark,
  default: themes.teams,
  contrast: themes.teamsHighContrast,
};
