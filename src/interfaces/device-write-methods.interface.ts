export interface DeviceWriteMethods {
  lists: () => Promise<void>;
  diffs: () => Promise<void>;
  failed: () => Promise<void>;
}
