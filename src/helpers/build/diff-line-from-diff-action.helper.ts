import type { DiffAction } from "../../types/diff-action.type.js";

const diffLineFromDiffAction = (diffAction: DiffAction): string => {
  switch (diffAction.type) {
    case "add-file":
      return `add-file|${diffAction.data.filename}`;
    case "remove-file":
      return `remove-file|${diffAction.data.filename}`;
  }
};

export default diffLineFromDiffAction;
