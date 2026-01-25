import type { AlejandroG751JTPaths } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-paths.interface.js";

const buildMediaDiffsProjectDirPaths = (
  paths: AlejandroG751JTPaths["dirs"]["project"],
): string[] => {
  const projectPaths: string[] = [
    paths.base,
    paths.diffs.base,
    paths.diffs["content-targets"].media.base,
  ];

  for (const [, mediaNameDirPath] of Object.entries(
    paths.diffs["content-targets"].media.names,
  ))
    projectPaths.push(mediaNameDirPath);

  return projectPaths;
};

export default buildMediaDiffsProjectDirPaths;
