import useAsyncData from "../hooks/useAsyncData";
import { getProjects, VSTSProject, getPinnedProjecs, togglePin } from "./api";
import { useState, useCallback } from "react";

const PAGE_SIZE = 50;
export default function useProjects(onlyPinned = false) {
  let { pinned, togglePinned } = usePinnedProjects();
  let { data: allProjects, isLoading, error } = useAsyncData(null, getProjects, []);
  let [filter, setFilter] = useState("");
  let [maxItems, setMaxItems] = useState(PAGE_SIZE);

  let filteredProjects = (allProjects || [])
    .filter((p: VSTSProject) => {
      if (!filter) return p;
      return p.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    })
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

  let pinnedProjects = filteredProjects.filter((p) => pinned.includes(p.name));
  let unPinnedProjects = filteredProjects.filter((p) => !pinned.includes(p.name));
  let projects = [...pinnedProjects, ...(onlyPinned ? [] : unPinnedProjects)].slice(0, maxItems);

  const showMore =
    filteredProjects.length < maxItems ? null : () => setMaxItems((prev) => prev + PAGE_SIZE * 2);

  return {
    isLoading,
    error,
    projects,
    setFilter: (text) => {
      setMaxItems(PAGE_SIZE);
      setFilter(text);
    },
    pinned,
    filter,
    togglePinned,
    showMore,
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
