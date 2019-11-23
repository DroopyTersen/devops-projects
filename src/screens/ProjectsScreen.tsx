import React from "react";
import Layout, { BaseScreenProps } from "../components/appShell/Layout";
import { Header } from "@stardust-ui/react";
import { getProjects } from "../data/api";
import { useCurrentUser } from "../providers/CurrentUserProvider";
import { getToken } from "../auth/hybridAuth";
import useAsyncData from "../hooks/useAsyncData";

export default function ProjectsScreen({ location }: BaseScreenProps) {
  let { data: projects, isLoading, error } = useAsyncData(null, getProjects, []);

  return (
    <Layout>
      <>
        <Header>Projects</Header>
        <ProjectsContainer projects={projects} />
      </>
    </Layout>
  );
}

function ProjectsContainer({ projects }) {
  if (!projects) return <h2>Loading Projects....</h2>;
  if (projects && projects.length === 0) return <h2>No Projects Found</h2>;

  return <pre style={{ fontSize: "10px" }}>{JSON.stringify(projects, null, 2)}</pre>;
}
