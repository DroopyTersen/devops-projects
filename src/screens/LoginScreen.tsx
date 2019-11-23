import React from "react";
import Layout, { BaseScreenProps } from "../components/appShell/Layout";
import { Button, Header, Text, Segment } from "@stardust-ui/react";
import styled from "@emotion/styled";
import { navigate } from "@reach/router";

import * as microsoftTeams from "@microsoft/teams-js";
import { getAuthState, authenticate } from "../auth/hybridAuth";

export default function LoginScreen({ location }: BaseScreenProps) {
  let { teamsContext } = getAuthState();
  let onLoginClick = async () => {
    let { isAuthenticated } = await authenticate();

    if (isAuthenticated) {
      navigate("/projects");
    }
  };
  return (
    <StyledLayout>
      <Segment color={"brand"}>
        {teamsContext && teamsContext.userPrincipalName && (
          <Text>Hello {teamsContext.userPrincipalName}</Text>
        )}
        <Header as="h3">Click here to sign into your Account</Header>
        <Button size={"largest"} primary={true} onClick={onLoginClick}>
          Login
        </Button>
      </Segment>
    </StyledLayout>
  );
}
const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
`;
