import type {
  ConnectMethodError,
  DisconnectMethodError,
} from "./file-io.interface.js";

export interface Device {
  connect: () => Promise<ConnectMethodError | undefined>;
  disconnect: () => Promise<DisconnectMethodError | undefined>;
  populate: () => Promise<void>;
  filter: () => void;
  write: {
    lists: () => Promise<void>;
    diffs: () => Promise<void>;
  };
  sync: () => Promise<void>;
}
