export interface RemoveFileDiffAction {
  type: "remove-file";
  data: {
    filename: string;
  };
}
