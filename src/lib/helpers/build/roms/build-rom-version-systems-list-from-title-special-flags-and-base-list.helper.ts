import type Title from "../../../classes/entities/title.class.js";
import ROM_VERSION_SYSTEMS_FOR_UNRELEASED_ROMS_PRIORITY_LIST from "../../../constants/roms/rom-version-systems-for-unreleased-roms-priority-list.constant.js";
import type { RomVersionSystem } from "../../../interfaces/roms/rom-version-system.interface.js";

const buildRomVersionSystemsListFromTitleSpecialFlagsAndBaseList = (
  title: Title,
  baseRomVersionSystemsList: RomVersionSystem[],
): RomVersionSystem[] => {
  const specialFlags = title.getSpecialFlags("selected");
  const versionSystemsPriorityList: RomVersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystemsPriorityList.push(
      ...ROM_VERSION_SYSTEMS_FOR_UNRELEASED_ROMS_PRIORITY_LIST,
    );
  versionSystemsPriorityList.push(...baseRomVersionSystemsList);

  return versionSystemsPriorityList;
};

export default buildRomVersionSystemsListFromTitleSpecialFlagsAndBaseList;
