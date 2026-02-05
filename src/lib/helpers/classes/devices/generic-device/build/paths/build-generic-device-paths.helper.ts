import path from "path";
import type { GenericDeviceConsolesEnvData } from "../../../../../../types/classes/devices/generic-device/env/generic-device-consoles-env-data.type.js";
import type { ContentTargetPaths } from "../../../../../../types/content-targets/content-target-paths.type.js";
import type { GenericDevicePaths } from "../../../../../../interfaces/classes/devices/generic-device/paths/generic-device-paths.interface.js";
import type { ConsoleName } from "../../../../../../types/consoles/console-name.type.js";
import type { MediaName } from "../../../../../../types/media/media-name.type.js";
import { DEVICES_DIR_PATH } from "../../../../../../constants/paths.constants.js";
import type { MediaPaths } from "../../../../../../types/media/media-paths.type.js";
import type { ConsolePaths } from "../../../../../../types/consoles/console-paths.types.js";
import type { ConsoleContent } from "../../../../../../types/consoles/console-content.type.js";

const buildGenericDevicePaths = (
  name: string,
  consolesEnvData: GenericDeviceConsolesEnvData,
  contentTargetPaths: ContentTargetPaths,
): GenericDevicePaths => {
  const consoleNames: ConsoleName[] = [];
  const allMediaNamesSet = new Set<MediaName>();

  for (const [, consoleEnvData] of Object.entries(consolesEnvData)) {
    consoleNames.push(consoleEnvData.name);
    for (const mediaName of consoleEnvData["content-targets"].media.names)
      allMediaNamesSet.add(mediaName);
  }

  const allMediaNames = [...allMediaNamesSet];

  const baseDirPath = path.join(DEVICES_DIR_PATH, name);

  const logsDirPath = path.join(baseDirPath, "logs");

  const listsDirPath = path.join(baseDirPath, "lists");
  const romsListsDirPath = path.join(listsDirPath, "roms");
  const mediaListsDirPath = path.join(listsDirPath, "media");
  const esDeGamelistsListsDirPath = path.join(listsDirPath, "es-de-gamelists");

  const diffsDirPath = path.join(baseDirPath, "diffs");
  const romsDiffsDirPath = path.join(diffsDirPath, "roms");
  const mediaDiffsDirPath = path.join(diffsDirPath, "media");
  const esDeGamelistsDiffsDirPath = path.join(diffsDirPath, "es-de-gamelists");

  const failedDirPath = path.join(baseDirPath, "failed");
  const romsFailedDirPath = path.join(failedDirPath, "roms");
  const mediaFailedDirPath = path.join(failedDirPath, "media");
  const esDeGamelistsFailedDirPath = path.join(
    failedDirPath,
    "es-de-gamelists",
  );

  const paths: GenericDevicePaths = {
    dirs: {
      project: {
        base: baseDirPath,
        logs: {
          base: logsDirPath,
        },
        lists: {
          base: listsDirPath,
          "content-targets": {
            roms: romsListsDirPath,
            media: {
              base: mediaListsDirPath,
              names: Object.fromEntries(
                allMediaNames.map((m) => [m, path.join(mediaListsDirPath, m)]),
              ) as Partial<MediaPaths>,
            },
            "es-de-gamelists": esDeGamelistsListsDirPath,
          },
        },
        diffs: {
          base: diffsDirPath,
          "content-targets": {
            roms: romsDiffsDirPath,
            media: {
              base: mediaDiffsDirPath,
              names: Object.fromEntries(
                allMediaNames.map((m) => [m, path.join(mediaDiffsDirPath, m)]),
              ) as Partial<MediaPaths>,
            },
            "es-de-gamelists": esDeGamelistsDiffsDirPath,
          },
        },
        failed: {
          base: failedDirPath,
          "content-targets": {
            roms: romsFailedDirPath,
            media: {
              base: mediaFailedDirPath,
              names: Object.fromEntries(
                allMediaNames.map((m) => [m, path.join(mediaFailedDirPath, m)]),
              ) as Partial<MediaPaths>,
            },
            "es-de-gamelists": esDeGamelistsFailedDirPath,
          },
        },
      },
      "content-targets": {
        roms: {
          base: contentTargetPaths.roms,
          consoles: Object.fromEntries(
            consoleNames.map((c) => [c, path.join(contentTargetPaths.roms, c)]),
          ) as Partial<ConsolePaths>,
        },
        media: {
          base: contentTargetPaths.media,
          consoles: Object.fromEntries(
            Object.entries(consolesEnvData).map(([, c]) => [
              c.name,
              {
                base: path.join(contentTargetPaths.media, c.name),
                names: Object.fromEntries(
                  c["content-targets"].media.names.map((m) => [
                    m,
                    path.join(contentTargetPaths.media, c.name, m),
                  ]),
                ) as Partial<MediaPaths>,
              },
            ]),
          ) as Partial<
            ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
          >,
        },
        "es-de-gamelists": {
          base: contentTargetPaths["es-de-gamelists"],
          consoles: Object.fromEntries(
            consoleNames.map((c) => [
              c,
              path.join(contentTargetPaths["es-de-gamelists"], c),
            ]),
          ) as Partial<ConsolePaths>,
        },
      },
    },
    files: {
      project: {
        logs: {
          duplicates: path.join(logsDirPath, "duplicates.log.txt"),
          scrapped: path.join(logsDirPath, "scrapped.log.txt"),
        },
        lists: {
          roms: {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(romsListsDirPath, `${c}.list.txt`),
              ]),
            ) as Partial<ConsolePaths>,
          },
          media: {
            consoles: Object.fromEntries(
              Object.entries(consolesEnvData).map(([, c]) => [
                c.name,
                Object.fromEntries(
                  c["content-targets"].media.names.map((m) => [
                    m,
                    path.join(mediaListsDirPath, m, `${c.name}.list.txt`),
                  ]),
                ) as Partial<MediaPaths>,
              ]),
            ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
          },
          "es-de-gamelists": {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(esDeGamelistsListsDirPath, `${c}.list.xml`),
              ]),
            ) as Partial<ConsolePaths>,
          },
        },
        diffs: {
          roms: {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(romsDiffsDirPath, `${c}.diff.txt`),
              ]),
            ) as Partial<ConsolePaths>,
          },
          media: {
            consoles: Object.fromEntries(
              Object.entries(consolesEnvData).map(([, c]) => [
                c.name,
                Object.fromEntries(
                  c["content-targets"].media.names.map((m) => [
                    m,
                    path.join(mediaDiffsDirPath, m, `${c.name}.diff.txt`),
                  ]),
                ) as Partial<MediaPaths>,
              ]),
            ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
          },
          "es-de-gamelists": {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(esDeGamelistsDiffsDirPath, `${c}.diff.xml`),
              ]),
            ) as Partial<ConsolePaths>,
          },
        },
        failed: {
          roms: {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(romsFailedDirPath, `${c}.failed.txt`),
              ]),
            ) as Partial<ConsolePaths>,
          },
          media: {
            consoles: Object.fromEntries(
              Object.entries(consolesEnvData).map(([, c]) => [
                c.name,
                Object.fromEntries(
                  c["content-targets"].media.names.map((m) => [
                    m,
                    path.join(mediaFailedDirPath, m, `${c.name}.failed.txt`),
                  ]),
                ) as Partial<MediaPaths>,
              ]),
            ) as Partial<ConsoleContent<Partial<MediaPaths>>>,
          },
          "es-de-gamelists": {
            consoles: Object.fromEntries(
              consoleNames.map((c) => [
                c,
                path.join(esDeGamelistsFailedDirPath, `${c}.failed.txt`),
              ]),
            ) as Partial<ConsolePaths>,
          },
        },
      },
      "content-targets": {
        "es-de-gamelists": {
          consoles: Object.fromEntries(
            consoleNames.map((c) => [
              c,
              path.join(
                contentTargetPaths["es-de-gamelists"],
                c,
                "gamelist.xml",
              ),
            ]),
          ),
        },
      },
    },
  };

  return paths;
};

export default buildGenericDevicePaths;
