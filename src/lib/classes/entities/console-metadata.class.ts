import type { MediaName } from "../../types/media/media-name.type.js";
import ConsoleContentTargetsSkipFlags from "./console-content-targets-skip-flags.class.js";

class ConsoleMetadata {
  private _mediaNames: MediaName[];
  private _contentTargetSkipFlags: ConsoleContentTargetsSkipFlags;

  constructor(mediaNames: MediaName[]) {
    this._mediaNames = [...new Set(mediaNames)];
    this._contentTargetSkipFlags = new ConsoleContentTargetsSkipFlags(
      this._mediaNames,
    );
  }

  get mediaNames(): MediaName[] {
    return this._mediaNames;
  }

  get contentTargetSkipFlags(): ConsoleContentTargetsSkipFlags {
    return this._contentTargetSkipFlags;
  }
}

export default ConsoleMetadata;
