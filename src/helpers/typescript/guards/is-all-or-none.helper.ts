import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import type { AllOrNone } from "../../../types/all-or-none.type.js";

const isAllOrNone = (s: string): s is AllOrNone =>
  ALL_AND_NONE.includes(s as AllOrNone);

export default isAllOrNone;
