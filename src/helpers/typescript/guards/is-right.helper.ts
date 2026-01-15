import RIGHTS from "../../../constants/rights.constant.js";
import type { Right } from "../../../types/right.type.js";

const isRight = (r: string): r is Right => RIGHTS.includes(r as Right);

export default isRight;
