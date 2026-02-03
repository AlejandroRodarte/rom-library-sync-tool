export interface DeviceWriteMethods {
  lists: () => Promise<void>;
  diffs: () => Promise<void>;
}
