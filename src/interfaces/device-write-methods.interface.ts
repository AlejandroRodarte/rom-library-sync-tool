export interface DeviceWriteMethods {
  duplicates: () => Promise<void>;
  scrapped: () => Promise<void>;
  diffs: () => Promise<void>;
}
