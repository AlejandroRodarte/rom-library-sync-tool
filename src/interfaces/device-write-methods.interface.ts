export interface DeviceWriteMethods {
  duplicates: () => Promise<void>;
  scrapped: () => Promise<void>;
  lists: () => Promise<void>;
  diffs: () => Promise<void>;
  failed: () => Promise<void>;
}
