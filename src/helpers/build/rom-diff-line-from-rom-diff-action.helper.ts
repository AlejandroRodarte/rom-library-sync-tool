import type { RomDiffAction } from "../../types/rom-diff-action.type.js";

const romDiffLineFromRomDiffAction = (diffAction: RomDiffAction): string => {
  switch (diffAction.type) {
    case "add-rom":
      return `add-rom|${diffAction.data.fs.type}|${diffAction.data.filename}`;
    case "delete-rom":
      return `delete-rom|${diffAction.data.fs.type}|${diffAction.data.filename}`;
  }
};

export default romDiffLineFromRomDiffAction;
