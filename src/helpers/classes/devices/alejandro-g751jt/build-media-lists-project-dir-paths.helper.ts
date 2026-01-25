import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildMediaListsProjectDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["project"],
): string[] => {
  const projectPaths: string[] = [
    paths.base,
    paths.lists.base,
    paths.lists["content-targets"].media.base,
  ];

  for (const [, mediaNameDirPath] of Object.entries(
    paths.lists["content-targets"].media.names,
  ))
    projectPaths.push(mediaNameDirPath);

  return projectPaths;
};

export default buildMediaListsProjectDirPaths;
