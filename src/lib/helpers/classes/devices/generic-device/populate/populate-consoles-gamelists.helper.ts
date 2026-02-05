import { READ } from "../../../../../constants/rights/rights.constants.js";
import databasePaths from "../../../../../objects/database-paths.object.js";
import dbEsDeGamelistItemFields from "../../../../../objects/es-de-gamelists/db-es-de-gamelist-item-fields.object.js";
import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import fileExists from "../../../../extras/fs/file-exists.helper.js";
import buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile from "../build/xml/build-es-de-gamelist-root-xml-node-children-from-gamelist-xml-file.helper.js";
import populateGamelistWithXmlNodes from "./populate-gamelist-with-xml-nodes.helper.js";

const fsExtras = {
  fileExists,
};

const populateConsolesGamelists = async (consoles: Consoles): Promise<void> => {
  for (const [, konsole] of consoles) {
    const dbPath = databasePaths.getConsoleEsDeGamelistDatabaseFilePath(
      konsole.name,
    );

    const [fileExistsResult, fileExistsError] = await fsExtras.fileExists(
      dbPath,
      READ,
    );

    if (fileExistsError) {
      konsole.metadata.skipGlobalEsDeGamelist();
      continue;
    }

    if (!fileExistsResult.exists) {
      konsole.metadata.skipGlobalEsDeGamelist();
      continue;
    }

    const [dbEsDeGamelistXmlNodes, xmlBuildError] =
      await buildEsDeGamelistRootXmlNodeChildrenFromGamelistXmlFile(dbPath);

    if (xmlBuildError) {
      konsole.metadata.skipGlobalEsDeGamelist();
      continue;
    }

    const dbGameXmlNodes = dbEsDeGamelistXmlNodes.gameList?.at(0)?.game || [];
    const dbFolderXmlNodes =
      dbEsDeGamelistXmlNodes.gameList?.at(0)?.folder || [];

    populateGamelistWithXmlNodes(konsole.gamelist, {
      game: { xmlNodes: dbGameXmlNodes, fields: dbEsDeGamelistItemFields },
      folder: { xmlNodes: dbFolderXmlNodes, fields: dbEsDeGamelistItemFields },
    });
  }
};

export default populateConsolesGamelists;
