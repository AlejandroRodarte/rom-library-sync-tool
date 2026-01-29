import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { FileIOStrategy } from "../../../types/file-io-strategy.type.js";
import type { FileIOStrategyData } from "../../file-io-strategy-data.interface.js";
import type { ContentTargetPaths } from "../../../types/content-target-paths.type.js";
import type { ConsolesEnvData } from "../../../types/consoles-env-data.type.js";

export interface AlejandroG751JTData {
  consoles: ConsolesEnvData;
  "content-targets": {
    names: ContentTargetName[];
    paths: ContentTargetPaths;
  };
  fileIO: {
    strategy: FileIOStrategy;
    data: {
      [S in FileIOStrategy]: FileIOStrategyData[S];
    };
  };
}
