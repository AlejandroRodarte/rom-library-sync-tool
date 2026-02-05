import type { FsType } from "../../types/fs-type.type.js";
import type { RightsForValidation } from "../../types/rights/rights-for-validation.type.js";

export interface PathAccessItem {
  path: string;
  type: FsType;
  rights?: RightsForValidation;
}
