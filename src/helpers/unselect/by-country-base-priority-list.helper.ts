import type Title from "../../classes/title.class.js";
import COUNTRY_BASE_PRIORITY_LIST from "../../constants/country-base-priority-list.constant.js";
import byCountry from "./by-country.helper.js";

const byCountryBasePriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;
  byCountry(title, COUNTRY_BASE_PRIORITY_LIST);
};

export default byCountryBasePriorityList;
