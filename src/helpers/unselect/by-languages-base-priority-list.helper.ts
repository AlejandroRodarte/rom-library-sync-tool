import LANGUAGE_BASE_PRIORITY_LIST from "../../constants/language-base-priority-list.constant.js";
import type { Rom } from "../../types.js";
import byLanguages from "./by-languages.helper.js";

const byLanguagesBasePriorityList = (roms: Rom[], keepSelected = 1): void =>
  byLanguages(roms, LANGUAGE_BASE_PRIORITY_LIST, keepSelected);

export default byLanguagesBasePriorityList;
