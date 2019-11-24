import React from "react";
import { VSTSProject } from "../../data/api";
import { Segment, Header, Button, themes, Icon } from "@stardust-ui/react";
import styled from "@emotion/styled";
import { getAuthState } from "../../auth/hybridAuth";
import { getFluentTheme } from "../../providers/TeamsAppProvider";

function ProjectCard({ project, isPinned = false, togglePinned }: ProjectCardProps) {
  if (!project) return null;
  let links = getLinks(project);
  let { teamsContext } = getAuthState();
  let theme = getFluentTheme(teamsContext);
  return (
    <StyledSegment color="brand" theme={theme}>
      <StyledBookmarkButton
        title="Toggle Pinned"
        size="smallest"
        circular
        primary={isPinned}
        onClick={() => togglePinned(project.name)}
      >
        <Icon outline={!isPinned} name="bookmark" />
      </StyledBookmarkButton>
      <Header as="h3" styles={{ overflowWrap: "break-word" }}>
        {project.name}
      </Header>
      <StyledLinksContainer>
        <ButtonLink url={links.backlog} theme={theme}>
          Backlog
        </ButtonLink>
        <ButtonLink url={links.board} theme={theme}>
          Board
        </ButtonLink>
        <ButtonLink url={links.code} theme={theme}>
          Code
        </ButtonLink>
      </StyledLinksContainer>
    </StyledSegment>
  );
}

export default React.memo(ProjectCard);

const BASE_URL = "https://skyline.visualstudio.com";
const getLinks = function(project) {
  return {
    get code() {
      return `${BASE_URL}/${project.name}/_git`;
    },
    get backlog() {
      return `${BASE_URL}/${project.name}/_backlogs?level=Features&showParents=true&_a=backlog`;
    },
    get board() {
      return `${BASE_URL}/${project.name}/_backlogs/board`;
    },
  };
};

function ButtonLink({ url, children, theme }) {
  let isPrimary = theme === themes.teams;
  return (
    <a href={url} target="_blank">
      <Button color="brand" primary={isPrimary}>
        {children}
      </Button>
    </a>
  );
}

const StyledBookmarkButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;
const StyledSegment = styled(Segment)`
  position: relative;
  text-align: center;
  background: ${(props) => (props.theme === themes.teamsDark ? "#121215" : "initial")};
`;
const StyledLinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  a {
    text-decoration: none;
  }
`;
export interface ProjectCardProps {
  project: VSTSProject;
  isPinned: boolean;
  togglePinned: (projectName: string) => void;
}
