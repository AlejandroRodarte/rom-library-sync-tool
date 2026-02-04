import ALL_NONE_AND_REST from "./all-none-and-rest.constant.js";
import ALL_CONSOLE_NAMES from "./all-console-names.constant.js";

const CONSOLE_NAME_ALL_NONE_AND_REST = [
  ...ALL_CONSOLE_NAMES,
  ...ALL_NONE_AND_REST,
] as const;

export default CONSOLE_NAME_ALL_NONE_AND_REST;
