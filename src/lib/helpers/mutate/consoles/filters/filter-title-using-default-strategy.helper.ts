import type Title from "../../../../classes/entities/title.class.js";
import { BIOS_TITLE_SEGMENT } from "../../../../constants/roms/rom-title-segments.constnats.js";
import bannedRomLabelsPriorityList from "../../../../objects/helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy/banned-rom-labels-priority-list.object.js";
import romLanguagesPriorityList from "../../../../objects/helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy/language-base-priority-list.object.js";
import romCountriesPriorityList from "../../../../objects/helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy/rom-countries-priority-list.object.js";
import romVersionSystemsPriorityList from "../../../../objects/helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy/rom-version-systems-priority-list.object.js";
import whitelistedRomLabelsPriorityList from "../../../../objects/helpers/mutate/consoles/filters/filter-consoles-games-using-default-strategy/whitelisted-rom-labels-priority-list.object.js";
import buildRomVersionSystemsListFromTitleSpecialFlagsAndBaseList from "../../../build/roms/build-rom-version-systems-list-from-title-special-flags-and-base-list.helper.js";
import unselectManyByBannedLabelSegmentsImposedBySpecialFlags from "../title/filters/unselect/unselect-many-by-banned-label-segments-imposed-by-special-flags.helper.js";
import unselectManyByBannedLabelSegmentsPriorityList from "../title/filters/unselect/unselect-many-by-banned-label-segments-priority-list.helper.js";
import unselectManyByBannedLabelsPriorityList from "../title/filters/unselect/unselect-many-by-banned-labels-priority-list.helper.js";
import unselectManyByCountryPriorityList from "../title/filters/unselect/unselect-many-by-country-priority-list.helper.js";
import unselectManyByLanguageAmount from "../title/filters/unselect/unselect-many-by-language-amount.helper.js";
import unselectManyByLanguagesPriorityList from "../title/filters/unselect/unselect-many-by-languages-priority-list.helper.js";
import unselectManyByPALAndNTSCLabels from "../title/filters/unselect/unselect-many-by-pal-and-ntsc-labels.helper.js";
import unselectManyByVersionSystemsPriorityList from "../title/filters/unselect/unselect-many-by-version-systems-priority-list.helper.js";
import unselectManyByWhitelistedLabelsPriorityList from "../title/filters/unselect/unselect-many-by-whitelisted-labels-priority-list.helper.js";

const filterTitleUsingDefaultStrategy = (title: Title): void => {
  if (!title.canUnselect()) return;

  let type: "normal" | "bios" = "normal";
  const titleIsBios = title.name.includes(BIOS_TITLE_SEGMENT);
  if (titleIsBios) type = "bios";

  if (type === "normal") {
    unselectManyByCountryPriorityList(title, romCountriesPriorityList);
    unselectManyByLanguagesPriorityList(title, romLanguagesPriorityList);
    unselectManyByLanguageAmount(title);
  }

  unselectManyByBannedLabelSegmentsImposedBySpecialFlags(title);

  if (type === "normal")
    unselectManyByBannedLabelSegmentsPriorityList(title, ["Disk"]);

  unselectManyByVersionSystemsPriorityList(
    title,
    buildRomVersionSystemsListFromTitleSpecialFlagsAndBaseList(
      title,
      romVersionSystemsPriorityList,
    ),
  );

  if (type === "normal") {
    unselectManyByPALAndNTSCLabels(title);
    unselectManyByBannedLabelsPriorityList(title, bannedRomLabelsPriorityList);
    unselectManyByWhitelistedLabelsPriorityList(
      title,
      whitelistedRomLabelsPriorityList,
    );
  }
};

export default filterTitleUsingDefaultStrategy;
