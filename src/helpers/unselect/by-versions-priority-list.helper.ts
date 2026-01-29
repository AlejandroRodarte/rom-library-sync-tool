import type Title from "../../classes/title.class.js";
import VERSIONING_SYSTEMS_BASE_PRIORITY_LIST from "../../constants/versioning-systems-base-priority-list.constant.js";
import VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST from "../../constants/versioning-systems-for-unreleased-roms-base-priority-list.constant.js";
import type { VersionSystem } from "../../interfaces/version-system.interface.js";
import byVersionSystem from "./by-version-systems.helper.js";

const byVersionsPriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;

  const specialFlags = title.getSpecialFlags("selected");
  const versionSystemsPriorityList: VersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystemsPriorityList.push(
      ...VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST,
    );
  versionSystemsPriorityList.push(...VERSIONING_SYSTEMS_BASE_PRIORITY_LIST);

  byVersionSystem(title, versionSystemsPriorityList);
};

export default byVersionsPriorityList;
