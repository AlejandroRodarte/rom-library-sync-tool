export interface DeviceFileIOLsEntry {
  name: string;
  is: {
    file: boolean;
    dir: boolean;
    link: boolean;
  };
}
