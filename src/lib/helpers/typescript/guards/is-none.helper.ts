import { NONE } from "../../../constants/all-none-rest.constants.js";

const isNone = (s: string): s is typeof NONE => s === NONE;

export default isNone;
