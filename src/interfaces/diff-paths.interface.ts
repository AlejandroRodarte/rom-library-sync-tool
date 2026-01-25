export interface DiffPaths {
  project: {
    list: { dirs: string[]; files: string[] };
    diff: { dirs: string[] };
  };
}
