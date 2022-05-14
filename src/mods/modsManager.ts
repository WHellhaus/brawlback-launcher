import electronSettings from "electron-settings";
import fs from "fs";
import merge from "lodash/merge";
import set from "lodash/set";

import { defaultModConfig } from "./defaultMods";
import { ipc_modListUpdatedEvent } from "./ipc";
import type { Mod, ModConfig } from "./types";

electronSettings.configure({
  fileName: "Settings",
  prettify: true,
});

export class ModsManager {
  // only stores modified mods list
  private modList: Partial<ModConfig>;

  constructor() {
    if (!electronSettings.hasSync("mods")) {
      electronSettings.setSync("mods", defaultModConfig);
    }
    console.log(electronSettings.file());
    const restoredSettings = electronSettings.getSync("mods") as Partial<ModConfig>;

    // check to make launcher .elf path and sd card path exist
    restoredSettings.mods?.filter((mod: Partial<Mod>) => {
      if (mod.elfPath && mod.sdCardPath) {
        if (fs.existsSync(mod.elfPath) && fs.existsSync(mod.sdCardPath)) {
          return true;
        }
      }
      return false;
    });

    this.modList = restoredSettings;
  }

  public get(): ModConfig {
    // Join the settings with our default settings.
    // This allows us to change the defaults without persisting them
    // into the storage.
    return merge({}, defaultModConfig, this.modList);
  }

  // sets variable of Mod while also sending update event to renderer
  private async _set(objectPath: string, value: any) {
    await electronSettings.set(objectPath, value);
    set(this.modList, objectPath, value);
    await ipc_modListUpdatedEvent.main!.trigger(this.get());
  }
}
