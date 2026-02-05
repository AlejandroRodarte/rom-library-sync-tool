import xml2Js from "xml2js";

import type { OpenFileForWritingError } from "../../../../extras/fs/open-file-for-writing.helper.js";
import openFileForWriting from "../../../../extras/fs/open-file-for-writing.helper.js";
import writeLine, {
  type WriteLineError,
} from "../../../../extras/fs/write-line.helper.js";
import buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile, {
  type BuildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFileError,
} from "../build/xml/build-es-de-gamelist-root-xml-node-children-from-gamelist-xml-file.helper.js";
import Gamelist, {
  type XmlMethodError,
} from "../../../../../classes/entities/gamelist.class.js";
import populateGamelistWithXmlNodes from "../populate/populate-gamelist-with-xml-nodes.helper.js";
import deviceEsDeGamelistItemFields from "../../../../../objects/es-de-gamelists/device-es-de-gamelist-item-fields.object.js";
import esDeGamelistAlternativeEmulators from "../build/es-de-gamelists/es-de-gamelist-alternative-emulators.helper.js";
import stringWithoutFirstLine from "../../../../build/string-without-first-line.helper.js";
import type { WriteEsDeGamelistsDiffOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/write-es-de-gamelists-diff-operation.interface.js";

const fsExtras = {
  writeLine,
  openFileForWriting,
};

const build = {
  stringWithoutFirstLine,
};

export type WriteEsDeGamelistsDiffError =
  | BuildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFileError
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
    await buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile(
      op.paths.project.list.file,
    );
  if (xmlBuildError) return xmlBuildError;

  const deviceGamelist = new Gamelist();

  const deviceGameXmlNodes =
    deviceEsDeGamelistXmlNodes.gameList?.at(0)?.game || [];
  const deviceFolderXmlNodes =
    deviceEsDeGamelistXmlNodes.gameList?.at(0)?.folder || [];

  populateGamelistWithXmlNodes(deviceGamelist, {
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
      esDeGamelistAlternativeEmulators(deviceAlternativeEmulatorLabels),
    );
  }

  const diffContent = `<?xml version="1.0"?>\n${deviceAlternativeEmulatorXml ? `${build.stringWithoutFirstLine(deviceAlternativeEmulatorXml)}\n` : deviceAlternativeEmulatorXml}${build.stringWithoutFirstLine(deviceGamelistXml)}\n`;

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
