import type { DiffAction } from "../../types.js";

const diffActionFromDiffLine = (
  diffLine: string,
): [DiffAction, undefined] | [undefined, Error] => {
  const action = diffLine.split("|");

  if (action.length !== 2)
    return [
      undefined,
      new Error(
        "A diff line should be an action composed of exactly 2 parts: an action name, and action data associated with it.",
      ),
    ];

  const [actionName, actionData] = action;
  if (!actionName || !actionData)
    return [undefined, new Error("Action name and/or action data is missing.")];

  const filename = actionData.split("/").at(-1);
  if (!filename)
    return [undefined, new Error("No filename found for add-file action.")];

  switch (actionName) {
    case "add-file":
      return [{ type: "add-file", data: { filename } }, undefined];
    case "remove-file":
      return [{ type: "remove-file", data: { filename } }, undefined];
    default:
      return [undefined, new Error("Unrecognized action.")];
  }
};

export default diffActionFromDiffLine;
