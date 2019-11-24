import React, { useState } from "react";
import Layout, { BaseScreenProps } from "../components/appShell/Layout";
import { Header, Input } from "@stardust-ui/react";
import { getProjects, VSTSProject } from "../data/api";
import useAsyncData from "../hooks/useAsyncData";
import styled from "@emotion/styled";
import ProjectCard from "../components/projects/ProjectCard";
import useDebounce from "../hooks/useDebounce";
import { getAuthState } from "../auth/hybridAuth";
import useProjects, { usePinnedProjects } from "../data/useProjects";
import { getQueryStringData } from "../utils/utils";

export default function ProjectsScreen({ location }: BaseScreenProps) {
  let { isTeams } = getAuthState();
  let { pinned = false } = getQueryStringData();
  return (
    <Layout>
      <>
        {!isTeams && (
          <Header as="h2" styles={{ marginTop: "0" }}>
            Azure DevOps Projects
          </Header>
        )}
        <Projects onlyPinned={pinned} />
      </>
    </Layout>
  );
}

function Projects({ onlyPinned = false }) {
  let { isLoading, error, projects, setFilter, pinned, togglePinned } = useProjects(50, onlyPinned);
  if (isLoading) return <Header as="h2">Loading Projects....</Header>;
  if (error) return <Header as="h2">ERROR</Header>;

  return (
    <div>
      <div>
        <SearchBox onChange={setFilter} />
      </div>
      {projects && projects.length === 0 ? (
        <em>No Projects Found</em>
      ) : (
        <StyledProjectsList>
          {projects.map((project) => (
            <ProjectCard
              project={project}
              key={project.id}
              togglePinned={togglePinned}
              isPinned={pinned.includes(project.name)}
            />
          ))}
        </StyledProjectsList>
      )}
    </div>
  );
}

function SearchBox({ onChange }) {
  let [inputValue, setInputValue] = useState("");
  useDebounce(
    () => {
      onChange(inputValue);
    },
    300,
    [inputValue]
  );
  return (
    <Input
      styles={{ marginBottom: "15px" }}
      fluid
      icon="search"
      clearable={true}
      placeholder="Search..."
      onChange={(e, { value }) => setInputValue(value)}
    />
  );
}

const StyledProjectsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  grid-gap: 20px;
`;
