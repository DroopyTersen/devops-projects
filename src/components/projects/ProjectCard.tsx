import React, { useState } from "react";
import { VSTSProject, VSTSGitRepo, getRepositories } from "../../data/api";
import {
  Segment,
  Header,
  Button,
  themes,
  Icon,
  ThemePrepared,
  SplitButton,
  Loader,
  Text,
} from "@stardust-ui/react";
import styled from "@emotion/styled";
import useAsyncData from "../../hooks/useAsyncData";
import { async } from "q";

function ProjectCard({
  project,
  isPinned = false,
  togglePinned,
  theme = themes.teams,
}: ProjectCardProps) {
  console.log("RENDERING", project.name);
  if (!project) return null;
  let links = getLinks(project);

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
      <StyledProjectName>{project.name}</StyledProjectName>
      <StyledLinksContainer>
        <ButtonLink url={links.backlog} theme={theme}>
          Backlog
        </ButtonLink>
        <ButtonLink url={links.board} theme={theme}>
          Board
        </ButtonLink>
        <CodeButton url={links.code} theme={theme} projectName={project.name} />
      </StyledLinksContainer>
    </StyledSegment>
  );
}

export default React.memo(ProjectCard);
// export default ProjectCard;

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

export function CodeButton({ url, theme, projectName }) {
  let [shouldLoadRepos, setShouldLoadRepos] = useState(false);
  let { data: repos, isLoading, error } = useAsyncData<VSTSGitRepo[]>(
    null,
    async (shouldLoad, projectName) => {
      if (!shouldLoad) return null;
      return getRepositories(projectName);
    },
    [shouldLoadRepos, projectName]
  );
  let isPrimary = theme === themes.teams;

  let menu: any = [{ key: "status", content: "" }];

  if (repos && repos.length) {
    menu = repos.map((repo) => ({
      key: repo.name,
      content: (
        <a href={repo.webUrl} target="_blank">
          <Text color="brand">{repo.name}</Text>
        </a>
      ),
    }));
  } else if (repos && !repos.length) {
    menu = [{ key: "status", content: <Text color="brand">No GIT Repositories found</Text> }];
  }
  let button = {
    content: "Code",
  };
  return (
    <SplitButton
      primary={isPrimary}
      key={"code-button-" + projectName}
      menu={menu}
      button={button}
      onOpenChange={(e, { open }) => setShouldLoadRepos(open)}
      onMainButtonClick={() => window.open(url)}
    />
  );
}

export function ButtonLink({ url, children, theme }) {
  let isPrimary = theme === themes.teams;
  return (
    <a href={url} target="_blank">
      <Button color="brand" primary={isPrimary}>
        {children}
      </Button>
    </a>
  );
}

const StyledProjectName = styled(Header)`
  letter-spacing: 0.3px;
  font-weight: 200;
  font-size: 1.15em;
  overflow-wrap: break-word;
`;

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
  theme: ThemePrepared;
}
