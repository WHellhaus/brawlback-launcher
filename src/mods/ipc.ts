//import type { EmptyPayload, SuccessPayload } from "utils/ipc";
import { _, makeEndpoint } from "utils/ipc";

import type { ModConfig } from "./types";

// Handlers

// Events
export const ipc_modListUpdatedEvent = makeEndpoint.renderer("mods_modListUpdated", <ModConfig>_);
