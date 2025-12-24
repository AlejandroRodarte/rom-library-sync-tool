import type { Rom } from "../types.js";

const discardRomsWithPALLabelIfRomsetHasNTSCRoms = (roms: Rom[]): void => {
  const romSetHasNTSCLabel = roms.some((rom) =>
    rom.labels.some((label) => label.includes("NTSC")),
  );
  if (!romSetHasNTSCLabel) return;

  const palRoms = roms.filter((rom) =>
    rom.labels.some((label) => label.includes("PAL")),
  );
  palRoms.forEach((rom) => (rom.selected = false));
};

export default discardRomsWithPALLabelIfRomsetHasNTSCRoms;
