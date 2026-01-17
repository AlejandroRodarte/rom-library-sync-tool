export interface PathAccessItem {
  path: string;
  type: "file" | "dir" | "link";
  rights?: "r" | "w" | "rw";
}
