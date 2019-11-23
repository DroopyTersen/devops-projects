import React from "react";
import Layout, { BaseScreenProps } from "../components/appShell/Layout";
import { Header, Text } from "@stardust-ui/react";

import { stringify } from "querystring";
import * as Teams from "@microsoft/teams-js";
import { authenticate } from "../auth/msalAuth";
export default function TeamsSigninPopup({ location }: BaseScreenProps) {
  React.useEffect(() => {
    console.log("HERE WE ARE!!");
    authenticate().then((result) => Teams.authentication.notifySuccess(result as any));
  }, []);

  return <Text>One moment...</Text>;
}
