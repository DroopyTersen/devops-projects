import React from "react";
import styled from "@emotion/styled";

export default function Layout({ children, className = "" }: AppScreenProps) {
  return <StyledScreen className={"screen " + className}>{children}</StyledScreen>;
}

export interface AppScreenProps {
  className?: string;
  /** Screen's main content */
  children: JSX.Element;
}

export interface BaseScreenProps {
  path?: string;
  location?: Location;
  default?: boolean;
}

const StyledScreen = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 15px 25px;
`;
