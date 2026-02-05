import type Title from "../../classes/entities/title.class.js";
import { BIOS_TITLE_SEGMENT } from "../../constants/roms/rom-title-segments.constnats.js";
import byBiosTitle from "./by-bios-title.helper.js";
import byNormalTitle from "./by-normal-title.helper.js";

const bySteamDeckDevice = (title: Title): void => {
  let type: "normal" | "bios" = "normal";
  const titleIsBios = title.name.includes(BIOS_TITLE_SEGMENT);
  if (titleIsBios) type = "bios";

  switch (type) {
    case "normal":
      byNormalTitle(title);
      break;
    case "bios":
      byBiosTitle(title);
      break;
    default:
      break;
  }
};

export default bySteamDeckDevice;
