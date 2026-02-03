import NONE from "../../../constants/none.constant.js";
import type { None } from "../../../types/none.type.js";

const isNone = (s: string): s is None => s === NONE;

export default isNone;
