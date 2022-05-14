/* eslint-disable import/no-default-export */
import { ipcRenderer } from "electron";

import { ipc_modListUpdatedEvent } from "./ipc";
import type { ModConfig } from "./types";

export default {
  getModsConfigSync(): ModConfig {
    return ipcRenderer.sendSync("getModsConfigSync") as ModConfig;
  },
  onModsListUpdated(handle: (modList: ModConfig) => void) {
    const { destroy } = ipc_modListUpdatedEvent.renderer!.handle(async (modList) => {
      handle(modList);
    });
    return destroy;
  },
};
