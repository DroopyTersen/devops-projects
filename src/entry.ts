import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { initAuth } from "./auth/hybridAuth";
const unAuthenticatedPaths = ["/login", "/teams-signin"];
initAuth().then((authState) => {
  console.log("TCL: authState", authState);

  if (!authState.isAuthenticated && !unAuthenticatedPaths.includes(window.location.pathname)) {
    window.location.href = window.location.origin + "/login";
  } else {
    ReactDOM.render(React.createElement(App), document.getElementById("root"));
  }
});
