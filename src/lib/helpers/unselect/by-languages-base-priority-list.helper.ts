import type Title from "../../classes/entities/title.class.js";
import LANGUAGE_BASE_PRIORITY_LIST from "../../objects/classes/devices/generic-device/language-base-priority-list.constant.js";
import byLanguages from "./by-languages.helper.js";

const byLanguagesBasePriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;
  byLanguages(title, LANGUAGE_BASE_PRIORITY_LIST);
};

export default byLanguagesBasePriorityList;
