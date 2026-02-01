import xml2Js from "xml2js";

import type { EsDeGamelistRootXmlNode } from "../../../../interfaces/es-de-gamelist-root-xml-node.interface.js";
import readFile, {
  type ReadFileError,
} from "../../../wrappers/modules/fs/read-file.helper.js";
import type { ParseStringPromiseError } from "../../../wrappers/modules/xml2js/parse-string-promise.helper.js";
import parseStringPromise from "../../../wrappers/modules/xml2js/parse-string-promise.helper.js";

export type BuildEsDeGamelistRootXmlNodeChildrenError =
  | ReadFileError
  | ParseStringPromiseError;

const buildEsDeGamelistRootXmlNodeChildren = async (
  path: string,
): Promise<
  | [EsDeGamelistRootXmlNode["root"], undefined]
  | [undefined, BuildEsDeGamelistRootXmlNodeChildrenError]
> => {
  const [rawXml, readFileError] = await readFile(path, { encoding: "utf8" });
  if (readFileError) return [undefined, readFileError];

  const xml = `<root>${rawXml}</root>`;
  const [parsedXml, parsingError] = await parseStringPromise(xml);

  if (parsingError) return [undefined, parsingError];

  const castedXml = parsedXml as EsDeGamelistRootXmlNode;
  return [castedXml.root, undefined];
};

export default buildEsDeGamelistRootXmlNodeChildren;
