import xml2Js from "xml2js";
import SerializerProcessingError from "../../../../classes/errors/serializer-processing-error.class.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";

export type BuildObjectError = UnknownError | SerializerProcessingError;

const buildObject = (
  builder: xml2Js.Builder,
  ...args: Parameters<typeof builder.buildObject>
):
  | [ReturnType<typeof builder.buildObject>, undefined]
  | [undefined, BuildObjectError] => {
  try {
    const result = builder.buildObject(...args);
    return [result, undefined];
  } catch (e: unknown) {
    if (e instanceof Error)
      return [
        undefined,
        new SerializerProcessingError(
          `There was a problem serializing the JavaScript object into an XML. Error name: ${e.name}. Error message: ${e.message}.`,
        ),
      ];

    return [
      undefined,
      new UnknownError(
        `An unknown error happened while trying to serialize the JavaScript object into an XML.`,
      ),
    ];
  }
};

export default buildObject;
