import type { Right } from "../../../types/right.type.js";
import isRight from "./is-right.helper.js";

const isRightList = (list: string[]): list is Right[] =>
  list.every((r) => isRight(r));

export default isRightList;
