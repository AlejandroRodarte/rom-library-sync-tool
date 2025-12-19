import type { Rom } from "./types.js";

const unselectPAL = (roms: Rom[]): void => {
  let romHasNTSCLabel = false;

  for (const rom of roms) {
    for (const label of rom.labels) {
      if (label.includes("NTSC")) {
        romHasNTSCLabel = true;
        break;
      }
    }
    if (romHasNTSCLabel) break;
  }

  if (romHasNTSCLabel) {
    for (const rom of roms) {
      if (!rom.selected) continue;
      for (const label of rom.labels) {
        if (label.includes("PAL")) {
          rom.selected = false;
          break;
        }
      }
    }
  }
};

export default unselectPAL;
