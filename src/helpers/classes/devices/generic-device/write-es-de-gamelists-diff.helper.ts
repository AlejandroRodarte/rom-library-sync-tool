import xml2Js from "xml2js";

import Gamelist, {
  type XmlMethodError,
} from "../../../../classes/gamelist.class.js";
import type { WriteEsDeGamelistsDiffOperation } from "../../../../interfaces/write-es-de-gamelists-diff-operation.interface.js";
import deviceEsDeGamelistItemFields from "../../../../objects/device-es-de-gamelist-item-fields.object.js";
import esDeGamelistAlternativeEmulators from "../../../build/es-de-gamelist-alternative-emulators.helper.js";
import stringWithoutFirstLine from "../../../build/string-without-first-line.helper.js";
import buildEsDeGamelistRootXmlNodeChildren, {
  type BuildEsDeGamelistRootXmlNodeChildrenError,
} from "../../../extras/fs/xml/build-es-de-gamelist-root-xml-node-children.helper.js";
import populateGamelistWithXmlNodes from "../../../mutate/populate-gamelist-with-xml-nodes.helper.js";
import type { OpenFileForWritingError } from "../../../extras/fs/open-file-for-writing.helper.js";
import openFileForWriting from "../../../extras/fs/open-file-for-writing.helper.js";
import writeLine, {
  type WriteLineError,
} from "../../../extras/fs/write-line.helper.js";

const fsExtras = {
  buildEsDeGamelistRootXmlNodeChildren,
  writeLine,
  openFileForWriting,
};

const mutate = {
  populateGamelistWithXmlNodes,
};

const build = {
  stringWithoutFirstLine,
  esDeGamelistAlternativeEmulators,
};

export type WriteEsDeGamelistsDiffError =
  | BuildEsDeGamelistRootXmlNodeChildrenError
  | XmlMethodError
  | OpenFileForWritingError
  | WriteLineError;

const writeEsDeGamelistsDiff = async (
  op: WriteEsDeGamelistsDiffOperation,
): Promise<WriteEsDeGamelistsDiffError | undefined> => {
  const [diffFileHandle, diffFileError] = await fsExtras.openFileForWriting(
    op.paths.project.diff.file,
    { overwrite: true },
  );
  if (diffFileError) return diffFileError;

  const [deviceEsDeGamelistXmlNodes, xmlBuildError] =
    await fsExtras.buildEsDeGamelistRootXmlNodeChildren(
      op.paths.project.list.file,
    );
  if (xmlBuildError) return xmlBuildError;

  const deviceGamelist = new Gamelist();

  const deviceGameXmlNodes =
    deviceEsDeGamelistXmlNodes.gameList?.at(0)?.game || [];
  const deviceFolderXmlNodes =
    deviceEsDeGamelistXmlNodes.gameList?.at(0)?.folder || [];

  mutate.populateGamelistWithXmlNodes(deviceGamelist, {
    game: {
      xmlNodes: deviceGameXmlNodes,
      fields: deviceEsDeGamelistItemFields,
    },
    folder: {
      xmlNodes: deviceFolderXmlNodes,
      fields: deviceEsDeGamelistItemFields,
    },
  });

  for (const [dbRomFilename, dbEsDeGamelistItem] of op.console.gamelist
    .gameEntries) {
    if (deviceGamelist.hasGame(dbRomFilename)) continue;
    deviceGamelist.addGame(dbRomFilename, dbEsDeGamelistItem);
  }

  for (const [dbRomDirname, dbEsDeGamelistItem] of op.console.gamelist
    .folderEntries) {
    if (deviceGamelist.hasFolder(dbRomDirname)) continue;
    deviceGamelist.addFolder(dbRomDirname, dbEsDeGamelistItem);
  }

  const [deviceGamelistXml, serializationError] = deviceGamelist.xml();
  if (serializationError) return serializationError;

  const deviceAlternativeEmulatorLabels =
    deviceEsDeGamelistXmlNodes.alternativeEmulator?.at(0)?.label || [];

  let deviceAlternativeEmulatorXml = "";
  if (deviceAlternativeEmulatorLabels.length > 0) {
    const alternativeEmulatorBuilder = new xml2Js.Builder({
      rootName: "alternativeEmulator",
    });
    deviceAlternativeEmulatorXml = alternativeEmulatorBuilder.buildObject(
      build.esDeGamelistAlternativeEmulators(deviceAlternativeEmulatorLabels),
    );
  }

  const diffContent = `<?xml version="1.0"?>\n${deviceAlternativeEmulatorXml ? `${stringWithoutFirstLine(deviceAlternativeEmulatorXml)}\n` : deviceAlternativeEmulatorXml}${stringWithoutFirstLine(deviceGamelistXml)}\n`;

  const writeError = await fsExtras.writeLine(
    diffFileHandle,
    diffContent,
    "utf8",
  );

  if (writeError) {
    await diffFileHandle.close();
    return writeError;
  }

  await diffFileHandle.close();
};

export default writeEsDeGamelistsDiff;
