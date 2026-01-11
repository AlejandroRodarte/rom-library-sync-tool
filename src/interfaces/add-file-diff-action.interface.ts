export interface AddFileDiffAction {
  type: "add-file";
  data: {
    filename: string;
  };
}
