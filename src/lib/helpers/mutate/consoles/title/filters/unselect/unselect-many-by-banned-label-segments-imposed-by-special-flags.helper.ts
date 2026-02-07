import type Title from "../../../../../../classes/entities/title.class.js";
import {
  BETA_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
  VIRTUAL_CONSOLE_LABEL_SEGMENT,
} from "../../../../../../constants/roms/rom-label-segments.constants.js";
import unselectManyByBannedLabelSegmentsPriorityList from "./unselect-many-by-banned-label-segments-priority-list.helper.js";

const unselectManyByBannedLabelSegmentsImposedBySpecialFlags = (
  title: Title,
): void => {
  if (!title.canUnselect()) return;

  const specialFlags = title.getSpecialFlags("selected");
  const bannedLabelSegmentsPriorityList: string[] = [];

  if (!specialFlags.allRomsAreSample)
    bannedLabelSegmentsPriorityList.push(SAMPLE_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreDemo)
    bannedLabelSegmentsPriorityList.push(DEMO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreProto)
    bannedLabelSegmentsPriorityList.push(PROTO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreBeta)
    bannedLabelSegmentsPriorityList.push(BETA_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreForVirtualConsole)
    bannedLabelSegmentsPriorityList.push(VIRTUAL_CONSOLE_LABEL_SEGMENT);

  unselectManyByBannedLabelSegmentsPriorityList(
    title,
    bannedLabelSegmentsPriorityList,
  );
};

export default unselectManyByBannedLabelSegmentsImposedBySpecialFlags;
