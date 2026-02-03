import ALL_OR_NONE from "../../../constants/all-or-none.constant.js";
import type { AllOrNone } from "../../../types/all-or-none.type.js";

const isAllOrNone = (s: string): s is AllOrNone =>
  ALL_OR_NONE.includes(s as AllOrNone);

export default isAllOrNone;
