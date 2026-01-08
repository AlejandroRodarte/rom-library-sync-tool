import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import AppWrongTypeError from "../../classes/errors/app-wrong-type-error.class.js";
import type { DiffAction } from "../../types.js";

export type DiffActionFromDiffLineError =
  | AppValidationError
  | AppNotFoundError
  | AppWrongTypeError;

const diffActionFromDiffLine = (
  diffLine: string,
): [DiffAction, undefined] | [undefined, DiffActionFromDiffLineError] => {
  const action = diffLine.split("|");

  if (action.length !== 2)
    return [
      undefined,
      new AppValidationError(
        `Error procesing action ${action}. It should be a string made up of two substrings separated by a pipe (!) symbol.`,
      ),
    ];

  const [actionName, actionData] = action;
  if (!actionName || !actionData)
    return [
      undefined,
      new AppNotFoundError(
        `Error processing action ${action}. Action name and/or action data is missing.`,
      ),
    ];

  const filename = actionData.split("/").at(-1);
  if (!filename)
    return [
      undefined,
      new AppNotFoundError(
        `Error processing action data ${actionData}. A filename is missing.`,
      ),
    ];

  switch (actionName) {
    case "add-file":
      return [{ type: "add-file", data: { filename } }, undefined];
    case "remove-file":
      return [{ type: "remove-file", data: { filename } }, undefined];
    default:
      return [
        undefined,
        new AppWrongTypeError(
          `Action name ${actionName} is unsupported. Only "add-file" and "remove-file" actions are supported.`,
        ),
      ];
  }
};

export default diffActionFromDiffLine;
