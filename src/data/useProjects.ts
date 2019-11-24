import useAsyncData from "../hooks/useAsyncData";
import { getProjects, VSTSProject, getPinnedProjecs, togglePin } from "./api";
import { useState, useCallback } from "react";

export default function useProjects(maxItems = 100, onlyPinned = false) {
  let { pinned, togglePinned } = usePinnedProjects();
  let { data: allProjects, isLoading, error } = useAsyncData(null, getProjects, []);
  let [filter, setFilter] = useState("");

  let filteredProjects = (allProjects || [])
    .filter((p: VSTSProject) => {
      if (!filter) return p;
      return p.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    })
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

  let pinnedProjects = filteredProjects.filter((p) => pinned.includes(p.name));
  let unPinnedProjects = filteredProjects.filter((p) => !pinned.includes(p.name));
  let projects = [...pinnedProjects, ...(onlyPinned ? [] : unPinnedProjects)].slice(0, maxItems);
  return {
    isLoading,
    error,
    projects,
    setFilter,
    pinned,
    togglePinned,
  };
}

export function usePinnedProjects() {
  let [pinned, setPinned] = useState<string[]>(() => getPinnedProjecs());

  let togglePinned = useCallback((projectName: string) => {
    setPinned(togglePin(projectName));
  }, []);

  return {
    pinned,
    togglePinned,
  };
}
