import type { Rom } from "./types.js";

const unselectPAL = (roms: Rom[]): void => {
  const ntscLabelFound = roms.some((rom) => rom.labels.some((label) => label.includes("NTSC")));
  if (ntscLabelFound) {
    const palRoms = roms.filter((rom) => rom.labels.some((label) => label.includes("PAL")));
    palRoms.forEach((rom) => rom.selected = false);
  }
};

export default unselectPAL;
