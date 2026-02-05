export interface Device {
  populate: () => Promise<void>;
  filter: () => void;
  write: {
    lists: () => Promise<void>;
    diffs: () => Promise<void>;
  };
  sync: () => Promise<void>;
}
