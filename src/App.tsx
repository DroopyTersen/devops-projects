import React from "react";
import { Router } from "@reach/router";

import "./App.css";
import ProjectsScreen from "./screens/ProjectsScreen";
import LoginScreen from "./screens/LoginScreen";
import TeamsAppProvider from "./providers/TeamsAppProvider";
import TeamsSigninPopup from "./screens/TeamsSigninPopup";

function App({}) {
  return (
    <TeamsAppProvider>
      <Router>
        <ProjectsScreen path="/projects" default />
        <LoginScreen path="/login" />
        <TeamsSigninPopup path="/teams-signin" />
      </Router>
    </TeamsAppProvider>
  );
}

export default App;
