import VERSIONING_SYSTEMS_PRIORITY_LIST from "../../constants/versioning-systems-priority-list.constant.js";
import VERSIONING_SYSTEMS_PRIORITY_LIST_FOR_UNRELEASED_ROMS from "../../constants/versioning-systems-priority-list-for-unreleased-roms.constant.js";
import type { Rom, VersionSystem } from "../../types.js";
import getSpecialFlagsFromRomSet from "../get-special-flags-from-rom-set.helper.js";
import byVersionSystem from "./by-version-systems.helper.js";

const byVersionsPriorityList = (
  roms: Rom[],
  keepSelected = 1,
): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  const specialFlags = getSpecialFlagsFromRomSet(selectedRoms);
  const versionSystemsPriorityList: VersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystemsPriorityList.push(
      ...VERSIONING_SYSTEMS_PRIORITY_LIST_FOR_UNRELEASED_ROMS,
    );
  versionSystemsPriorityList.push(...VERSIONING_SYSTEMS_PRIORITY_LIST);

  byVersionSystem(selectedRoms, versionSystemsPriorityList);
};

export default byVersionsPriorityList;
