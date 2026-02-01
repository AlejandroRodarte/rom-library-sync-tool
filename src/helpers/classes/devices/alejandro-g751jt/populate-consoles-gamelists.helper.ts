import databasePaths from "../../../../objects/database-paths.object.js";
import dbEsDeGamelistItemFields from "../../../../objects/db-es-de-gamelist-item-fields.object.js";
import type { Consoles } from "../../../../types/consoles.type.js";
import fileExists from "../../../extras/fs/file-exists.helper.js";
import buildEsDeGamelistRootXmlNodeChildren from "../../../extras/fs/xml/build-es-de-gamelist-root-xml-node-children.helper.js";
import populateGamelistWithXmlNodes from "../../../mutate/populate-gamelist-with-xml-nodes.helper.js";

const fsExtras = {
  fileExists,
  buildEsDeGamelistRootXmlNodeChildren,
};

const mutate = {
  populateGamelistWithXmlNodes,
};

const populateConsolesGamelists = async (consoles: Consoles): Promise<void> => {
  for (const [, konsole] of consoles) {
    const dbPath = databasePaths.getConsoleEsDeGamelistDatabaseFilePath(
      konsole.name,
    );

    const [fileExistsResult, fileExistsError] = await fsExtras.fileExists(
      dbPath,
      "r",
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
      await buildEsDeGamelistRootXmlNodeChildren(dbPath);

    if (xmlBuildError) {
      konsole.metadata.skipGlobalEsDeGamelist();
      continue;
    }

    const dbGameXmlNodes = dbEsDeGamelistXmlNodes.gameList?.at(0)?.game || [];
    const dbFolderXmlNodes =
      dbEsDeGamelistXmlNodes.gameList?.at(0)?.folder || [];

    mutate.populateGamelistWithXmlNodes(konsole.gamelist, {
      game: { xmlNodes: dbGameXmlNodes, fields: dbEsDeGamelistItemFields },
      folder: { xmlNodes: dbFolderXmlNodes, fields: dbEsDeGamelistItemFields },
    });
  }
};

export default populateConsolesGamelists;
