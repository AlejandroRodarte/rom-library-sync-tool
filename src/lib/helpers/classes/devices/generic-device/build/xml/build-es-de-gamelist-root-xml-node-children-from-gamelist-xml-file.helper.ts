import type { EsDeGamelistRootXmlNode } from "../../../../../../interfaces/classes/devices/generic-device/xml/es-de-gamelist-root-xml-node.interface.js";
import readFile, {
  type ReadFileError,
} from "../../../../../wrappers/modules/fs/read-file.helper.js";
import parseStringPromise, {
  type ParseStringPromiseError,
} from "../../../../../wrappers/modules/xml2js/parse-string-promise.helper.js";

export type BuildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFileError =
  | ReadFileError
  | ParseStringPromiseError;

const buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile = async (
  path: string,
): Promise<
  | [EsDeGamelistRootXmlNode["root"], undefined]
  | [undefined, BuildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFileError]
> => {
  const [rawXml, readFileError] = await readFile(path, { encoding: "utf8" });
  if (readFileError) return [undefined, readFileError];

  const xml = `<root>${rawXml}</root>`;
  const [parsedXml, parsingError] = await parseStringPromise(xml);

  if (parsingError) return [undefined, parsingError];

  const castedXml = parsedXml as EsDeGamelistRootXmlNode;
  return [castedXml.root, undefined];
};

export default buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile;
