import COUNTRY_BASE_PRIORITY_LIST from "../../constants/country-base-priority-list.constant.js";
import type { Rom } from "../../types.js";
import byCountry from "./by-country.helper.js";

const byCountryBasePriorityList = (roms: Rom[], keepSelected = 1): void =>
  byCountry(roms, COUNTRY_BASE_PRIORITY_LIST, keepSelected);

export default byCountryBasePriorityList;
