import { ipcMain } from "electron";

import { 
  ipc_addNewMod,
  ipc_deleteMod,
  ipc_modListUpdatedEvent
 } from "./ipc";

import type { ModsManager } from "./modsManager";

export default function setupModsIpc({ modsManager }: { modsManager: ModsManager }) {
  ipcMain.on("getModsConfigSync", (event) => {
    const modsList = modsManager.get();
    event.returnValue = modsList;
  });
}
