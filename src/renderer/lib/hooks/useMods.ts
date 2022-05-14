import type { ModConfig } from "@mods/types";
import create from "zustand";
import { combine } from "zustand/middleware";

// get mods config from settings file
const initialState: ModConfig = window.electron.mods.getModsConfigSync();
console.log("initial state: ", initialState);

export const useMods = create(
  combine(
    {
      ...initialState,
    },
    (set) => ({
      updateMods: (modList: ModConfig) => set(() => modList),
    }),
  ),
);
