import ALL_INDIVIDUAL_RIGHTS from "../../../constants/rights/all-individual-rights.constant.js";
import type { IndividualRight } from "../../../types/rights/individual-right.type.js";

const isIndividualRight = (r: string): r is IndividualRight =>
  ALL_INDIVIDUAL_RIGHTS.includes(r as IndividualRight);

export default isIndividualRight;
