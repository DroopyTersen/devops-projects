import React from "react";
import { SplitButton, ThemePrepared, themes } from "@stardust-ui/react";

function CodeButton({ theme }: CodeButtonProps) {
  let isPrimary = theme === themes.teams;
  let repos;
  return <div>CodeButton</div>;
}

export default React.memo(CodeButton);

export interface CodeButtonProps {
  url: string;
  projectName: string;
  theme: ThemePrepared;
}
