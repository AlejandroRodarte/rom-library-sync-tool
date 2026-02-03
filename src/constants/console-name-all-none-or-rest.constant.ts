import ALL_OR_NONE from "./all-or-none.constant.js";
import CONSOLE_NAMES from "./console-names.constant.js";
import REST from "./rest.contant.js";

const CONSOLE_NAME_ALL_NONE_OR_REST = [
  ...CONSOLE_NAMES,
  ...ALL_OR_NONE,
   REST,
] as const;

export default CONSOLE_NAME_ALL_NONE_OR_REST;
