import type Title from "../../classes/entities/title.class.js";
import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";
import ROM_VERSIONING_SYSTEMS_BASE_PRIORITY_LIST from "../../objects/classes/devices/generic-device/rom-versioning-systems-base-priority-list.constant.js";
import ROM_VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST from "../../objects/classes/devices/generic-device/rom-versioning-systems-for-unreleased-roms-base-priority-list.constant.js";
import byVersionSystem from "./by-version-systems.helper.js";

const byVersionsPriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;

  const specialFlags = title.getSpecialFlags("selected");
  const versionSystemsPriorityList: RomVersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystemsPriorityList.push(
      ...ROM_VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST,
    );
  versionSystemsPriorityList.push(...ROM_VERSIONING_SYSTEMS_BASE_PRIORITY_LIST);

  byVersionSystem(title, versionSystemsPriorityList);
};

export default byVersionsPriorityList;
