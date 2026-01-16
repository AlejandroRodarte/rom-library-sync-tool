import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import type { DeviceFileIOStrategy } from "../../../types/device-file-io-strategy.type.js";
import type { DeviceFileIOStrategyData } from "../../device-file-io-strategy-data.interface.js";
import type { ConsoleName } from "../../../types/console-name.type.js";
import type { MediaName } from "../../../types/media-name.type.js";
import type { ContentTargetPaths } from "../../../types/content-target-paths.type.js";

export interface AlejandroG751JTData {
  console: {
    names: ConsoleName[];
  };
  media: {
    names: MediaName[];
  };
  "content-targets": {
    names: ContentTargetName[];
    paths: ContentTargetPaths;
  };
  fileIO: {
    strategy: DeviceFileIOStrategy;
    data: {
      [S in DeviceFileIOStrategy]: DeviceFileIOStrategyData[S];
    };
  };
}
