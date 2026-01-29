import type Title from "../../classes/title.class.js";
import {
  BETA_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
  VIRTUAL_CONSOLE_LABEL_SEGMENT,
} from "../../constants/label-segments.constants.js";
import byBannedLabelSegments from "./by-banned-label-segments.helper.js";

const byBannedLabelSegmentsImposedBySpecialFlags = (title: Title): void => {
  if (!title.canUnselect()) return;

  const specialFlags = title.getSpecialFlags("selected");
  const bannedLabelSegments: string[] = [];

  if (!specialFlags.allRomsAreSample)
    bannedLabelSegments.push(SAMPLE_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreDemo)
    bannedLabelSegments.push(DEMO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreProto)
    bannedLabelSegments.push(PROTO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreBeta)
    bannedLabelSegments.push(BETA_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreForVirtualConsole)
    bannedLabelSegments.push(VIRTUAL_CONSOLE_LABEL_SEGMENT);

  byBannedLabelSegments(title, bannedLabelSegments);
};

export default byBannedLabelSegmentsImposedBySpecialFlags;
