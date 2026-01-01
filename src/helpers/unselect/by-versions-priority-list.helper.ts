import VERSIONING_SYSTEMS_BASE_PRIORITY_LIST from "../../constants/versioning-systems-base-priority-list.constant.js";
import VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST from "../../constants/versioning-systems-for-unreleased-roms-base-priority-list.constant.js";
import type { Rom, VersionSystem } from "../../types.js";
import specialFlagsFromRoms from "../build/special-flags-from-roms.helper.js";
import byVersionSystem from "./by-version-systems.helper.js";

const byVersionsPriorityList = (roms: Rom[], keepSelected = 1): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  const specialFlags = specialFlagsFromRoms(selectedRoms);
  const versionSystemsPriorityList: VersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystemsPriorityList.push(
      ...VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST,
    );
  versionSystemsPriorityList.push(...VERSIONING_SYSTEMS_BASE_PRIORITY_LIST);

  byVersionSystem(selectedRoms, versionSystemsPriorityList);
};

export default byVersionsPriorityList;
