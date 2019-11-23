import React, { useState } from "react";
import Layout, { BaseScreenProps } from "../components/appShell/Layout";
import { Header, Input } from "@stardust-ui/react";
import { getProjects, VSTSProject } from "../data/api";
import useAsyncData from "../hooks/useAsyncData";
import styled from "@emotion/styled";
import ProjectCard from "../components/projects/ProjectCard";
import useDebounce from "../hooks/useDebounce";
import { getAuthState } from "../auth/hybridAuth";

export default function ProjectsScreen({ location }: BaseScreenProps) {
  let { data: projects, isLoading, error } = useAsyncData(null, getProjects, []);
  let { isTeams } = getAuthState();
  return (
    <Layout>
      <>
        {!isTeams && (
          <Header as="h2" styles={{ marginTop: "0" }}>
            Azure DevOps Projects
          </Header>
        )}
        <ProjectsContainer projects={projects} />
      </>
    </Layout>
  );
}

function ProjectsContainer({ projects }) {
  if (!projects) return <h2>Loading Projects....</h2>;
  if (projects && projects.length === 0) return <h2>No Projects Found</h2>;
  let [filter, setFilter] = useState("");

  let filteredProjects = projects
    .filter((p: VSTSProject) => {
      if (!filter) return p;
      return p.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    })
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1))
    .slice(0, 100);
  if (filter) {
  }
  return (
    <div>
      <div>
        <SearchBox onChange={setFilter} />
      </div>
      <StyledProjectsList>
        {filteredProjects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </StyledProjectsList>
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
