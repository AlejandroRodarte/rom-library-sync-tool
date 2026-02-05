import {
  BETA_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
  VIRTUAL_CONSOLE_LABEL_SEGMENT,
} from "../../../constants/roms/rom-label-segments.constants.js";
import type { Rom } from "../../../interfaces/roms/rom.interface.js";
import type { RomsSpecialFlags } from "../../../interfaces/roms/roms-special-flags.interface.js";

const UNRELEASED_LABEL_SEGMENT_LIST = [
  BETA_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
];

const buildRomsSpecialFlagsFromRomList = (roms: Rom[]): RomsSpecialFlags => {
  const allRomsAreUnreleased = roms.every((rom) =>
    rom.labels.some((label) => {
      for (const unwantedLabelSegment of UNRELEASED_LABEL_SEGMENT_LIST) {
        if (label.includes(unwantedLabelSegment)) return true;
      }
      return false;
    }),
  );

  const allRomsAreBeta = roms.every((rom) =>
    rom.labels.some((label) => label.includes(BETA_LABEL_SEGMENT)),
  );
  const allRomsAreProto = roms.every((rom) =>
    rom.labels.some((label) => label.includes(PROTO_LABEL_SEGMENT)),
  );
  const allRomsAreDemo = roms.every((rom) =>
    rom.labels.some((label) => label.includes(DEMO_LABEL_SEGMENT)),
  );
  const allRomsAreSample = roms.every((rom) =>
    rom.labels.some((label) => label.includes(SAMPLE_LABEL_SEGMENT)),
  );
  const allRomsAreForVirtualConsole = roms.every((rom) =>
    rom.labels.some((label) => label.includes(VIRTUAL_CONSOLE_LABEL_SEGMENT)),
  );

  return {
    allRomsAreUnreleased,
    allRomsAreBeta,
    allRomsAreProto,
    allRomsAreDemo,
    allRomsAreSample,
    allRomsAreForVirtualConsole,
  };
};

export default buildRomsSpecialFlagsFromRomList;
