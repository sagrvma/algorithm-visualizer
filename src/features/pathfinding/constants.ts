export const TILE_WEIGHTS = {
  NORMAL: 1,
  MEDIUM: 5,
  HEAVY: 15,
} as const;
// as const so that type is inferred as: { readonly NORMAL: 1; readonly MEDIUM: 5; readonly HEAVY: 15 and makes it all immutable.

//Weight display for UI
export const WEIGHT_COLOURS = {
  1: "transparent", // Normal - No special colour
  2: "#FFA500", //Medium - Orange
  3: "#8B4513", //Heavy - Brown
};

//Cycle order and clicking
export const WEIGHT_CYCLE = [1, 5, 15, 1]; //Click cycles through weights
