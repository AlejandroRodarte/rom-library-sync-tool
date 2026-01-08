import type { DiffAction } from "../../types.js";

const diffLineFromDiffAction = (diffAction: DiffAction): string => {
  switch (diffAction.type) {
    case "add-file":
      return `add-file|${diffAction.data.filename}`;
    case "remove-file":
      return `remove-file|${diffAction.data.filename}`;
    default:
      throw new Error("Unrecognized diff action. This should be unreachable.");
  }
};

export default diffLineFromDiffAction;
