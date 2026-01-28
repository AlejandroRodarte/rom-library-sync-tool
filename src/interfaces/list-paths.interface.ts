export interface ListPaths {
  project: {
    dirs: string[];
  };
  device: {
    dirs: string[];
    // special case for "es-de-gamelists" content target since we
    // we don't ls directories, but grab copies of the device's gamelist.xml files
    files?: string[];
  };
}
