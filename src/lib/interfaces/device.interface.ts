export interface Device {
  ConnectMethodErrorType: unknown;
  DisconnectMethodErrorType: unknown;

  ListMethodErrorType: unknown;
  DiffMethodErrorType: unknown;
  SyncMethodErrorType: unknown;

  connect: () => Promise<this["ConnectMethodErrorType"] | undefined>;
  disconnect: () => Promise<this["DisconnectMethodErrorType"] | undefined>;

  list: () => Promise<this["ListMethodErrorType"] | undefined>;
  diff: () => Promise<this["DiffMethodErrorType"] | undefined>;
  sync: () => Promise<this["SyncMethodErrorType"] | undefined>;
}
