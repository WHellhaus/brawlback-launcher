import setupBroadcastIpc from "@broadcast/setup";
import setupConsoleIpc from "@console/setup";
import { DolphinManager } from "@dolphin/manager";
import setupDolphinIpc from "@dolphin/setup";
import { ModsManager } from "@mods/modsManager";
import setupModsIpc from "@mods/setup";
import setupReplaysIpc from "@replays/setup";
import { SettingsManager } from "@settings/settingsManager";
import setupSettingsIpc from "@settings/setup";

import setupMainIpc from "./setup";

export function installModules() {
  const settingsManager = new SettingsManager();
  const dolphinManager = new DolphinManager(settingsManager);
  const modsManager = new ModsManager();
  setupDolphinIpc({ dolphinManager });
  setupBroadcastIpc({ settingsManager, dolphinManager });
  setupReplaysIpc();
  setupSettingsIpc({ settingsManager, dolphinManager });
  setupConsoleIpc({ dolphinManager });
  setupMainIpc();
  setupModsIpc({ modsManager });
  return { dolphinManager, settingsManager };
}
