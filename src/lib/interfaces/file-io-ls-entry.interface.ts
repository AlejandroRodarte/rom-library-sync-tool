export interface FileIOLsEntry {
  name: string;
  path: string;
  is: {
    file: boolean;
    dir: boolean;
    link: boolean;
  };
}
