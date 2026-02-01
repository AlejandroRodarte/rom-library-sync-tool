import xml2Js from "xml2js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import ParserProcessingError from "../../../../classes/errors/parser-processing-error.class.js";

export type ParseStringPromiseError = UnknownError | ParserProcessingError;

const parseStringPromise = async (
  ...args: Parameters<typeof xml2Js.parseStringPromise>
): Promise<
  | [Awaited<ReturnType<typeof xml2Js.parseStringPromise>>, undefined]
  | [undefined, ParseStringPromiseError]
> => {
  try {
    const result = await xml2Js.parseStringPromise(...args);
    return [result, undefined];
  } catch (e: unknown) {
    if (e instanceof Error)
      return [
        undefined,
        new ParserProcessingError(
          `Something went wrong parsing the XML string. Error name: ${e.name}. Error message: ${e.message}.`,
        ),
      ];

    return [
      undefined,
      new UnknownError(
        `An unknown error happened wile processing the XML error for parsing.`,
      ),
    ];
  }
};

export default parseStringPromise;
