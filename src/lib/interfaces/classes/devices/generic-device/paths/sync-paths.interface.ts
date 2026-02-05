export interface SyncPaths {
  project: {
    diff: { dirs: string[]; files: string[] };
    failed: { dirs: string[]; files: string[] };
  };
  device: {
    dirs: string[];
    // `ListPaths` has an optional `device.files?: string[]` property
    // to handle the "es-de-gamelists" content target, as it needs
    // to verify that `gamelist.xml` files exist for each console
    //
    // However, for sync-ing we don't really need to check if these files
    // exist: by the time we reach the `sync` stage, a `<console>.diff.xml` file
    // should be already prepared and ready to be copied over to the device's
    // console gamelist directory, replacing the old one if it happens to exist
    // files?: string[];
  };
}
