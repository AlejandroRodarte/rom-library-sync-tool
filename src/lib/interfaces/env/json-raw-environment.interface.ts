export interface JsonRawEnvironment {
  options: {
    log: {
      level: string;
    };
    mode: string;
    simulate: {
      sync: boolean;
    };
  };
  database: {
    paths: {
      [contentTargetName: string]: string;
    };
  };
  device: {
    names: {
      list: string | string[];
      diff: string | string[];
      sync: string | string[];
    };
    data: {
      [deviceName: string]: {
        populate: {
          games: {
            titleName: {
              build: {
                strategy: {
                  name: string;
                };
              };
            };
          };
        };
        consoles: {
          names: {
            list: string | string[];
            diff: string | string[];
            sync: string | string[];
          };
          media: {
            list:
              | string
              | {
                  [consoleNameAllNoneOrRest: string]: string | string[];
                };
            diff:
              | string
              | {
                  [consoleNameAllNoneOrRest: string]: string | string[];
                };
            sync:
              | string
              | {
                  [consoleNameAllNoneOrRest: string]: string | string[];
                };
          };
        };
        "content-targets": {
          names: string | string[];
          paths: {
            [contentTargetName: string]: string;
          };
        };
        fileIO: {
          strategy: {
            name: string;
            data: {
              fs: {
                crud: {
                  strategy: {
                    name: string;
                  };
                };
              };
              sftp: {
                credentials: {
                  host: string;
                  port: string;
                  username: string;
                  password: {
                    env: {
                      key: string;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}
