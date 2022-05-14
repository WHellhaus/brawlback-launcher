import { ipcMain } from "electron";

import type { ModsManager } from "./modsManager";

export default function setupModsIpc({ modsManager }: { modsManager: ModsManager }) {
  ipcMain.on("getModsConfigSync", (event) => {
    const modsList = modsManager.get();
    event.returnValue = modsList;
  });
}
