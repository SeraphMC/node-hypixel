/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2020 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import type { PlayerResponse } from "../types/AugmentedTypes";
import {
  MinecraftColorAsHex,
  MinecraftFormatting,
} from "./MinecraftFormatting";

/** @internal */
enum BEDWARS_LEVEL_CONSTANTS {
  EL = 4,
  XPP = 96 * 5000 + 7000,
  LPP = 100,
  HP = 10,
}

/**
 * Describes the results of the {@link getBedwarsLevelInfo} helper.
 */
export interface BedwarsLevelInfo {
  level: number;
  prestige: number;
  prestigeName: string;
  prestigeColor: string;
  prestigeColorHex: string;
  levelInCurrentPrestige: number;
}

/**
 * Calculates the BedWars prestige and level of a player and returns a {@link BedwarsLevelInfo} interface.
 * @category Helper
 */
export function getBedwarsLevelInfo(
  data: PlayerResponse["player"] | number
): BedwarsLevelInfo {
  const currentExp =
    typeof data === "number"
      ? data
      : data.stats?.Bedwars?.Experience ?? data.stats?.Bedwars?.Experience_new;
  if (typeof currentExp !== "number" || Number.isNaN(currentExp)) {
    throw new TypeError(
      "Data supplied does not contain player Bedwars experience."
    );
  }
  const prestiges = Math.floor(currentExp / BEDWARS_LEVEL_CONSTANTS.XPP);
  let level = prestiges * BEDWARS_LEVEL_CONSTANTS.LPP;
  let expWithoutPrestiges =
    currentExp - prestiges * BEDWARS_LEVEL_CONSTANTS.XPP;
  for (let i = 1; i <= BEDWARS_LEVEL_CONSTANTS.EL; i += 1) {
    let elExp = 500;
    const rL = i % BEDWARS_LEVEL_CONSTANTS.LPP;

    for (let ii = 0; ii < rL; ii += 1) {
      elExp += ii * 500;
    }

    if (expWithoutPrestiges < elExp) {
      break;
    }
    level += 1;
    expWithoutPrestiges -= elExp;
  }
  level += Math.floor(expWithoutPrestiges / 5000);
  let prestige = Math.floor(level / BEDWARS_LEVEL_CONSTANTS.LPP);
  if (prestige > BEDWARS_LEVEL_CONSTANTS.HP) {
    prestige = BEDWARS_LEVEL_CONSTANTS.HP;
  }
  let prestigeName = "None";
  let prestigeColor = MinecraftFormatting.GRAY;
  switch (prestige) {
    case 1:
      prestigeName = "Iron";
      prestigeColor = MinecraftFormatting.WHITE;
      break;
    case 2:
      prestigeName = "Gold";
      prestigeColor = MinecraftFormatting.GOLD;
      break;
    case 3:
      prestigeName = "Diamond";
      prestigeColor = MinecraftFormatting.AQUA;
      break;
    case 4:
      prestigeName = "Emerald";
      prestigeColor = MinecraftFormatting.DARK_GREEN;
      break;
    case 5:
      prestigeName = "Sapphire";
      prestigeColor = MinecraftFormatting.DARK_AQUA;
      break;
    case 6:
      prestigeName = "Ruby";
      prestigeColor = MinecraftFormatting.DARK_RED;
      break;
    case 7:
      prestigeName = "Crystal";
      prestigeColor = MinecraftFormatting.LIGHT_PURPLE;
      break;
    case 8:
      prestigeName = "Opal";
      prestigeColor = MinecraftFormatting.BLUE;
      break;
    case 9:
      prestigeName = "Amethyst";
      prestigeColor = MinecraftFormatting.DARK_PURPLE;
      break;
    case 10:
      prestigeName = "Rainbow";
      prestigeColor = MinecraftFormatting.WHITE;
      break;
    default:
    // noop
  }
  const levelInCurrentPrestige = level - prestige * BEDWARS_LEVEL_CONSTANTS.LPP;
  return {
    level,
    prestige,
    prestigeName,
    prestigeColor,
    prestigeColorHex: MinecraftColorAsHex[prestigeColor],
    levelInCurrentPrestige,
  };
}

/**
 * Describes the results of the {@link getBedwarsLevelInfoV2} helper.
 */
export interface BedwarsLevelInfoV2 {
  level: number;
  prestige: number;
  prestigeName: string;
  prestigeColor: BedwarsPrestigeFormats;
  prestigeColorHex: string;
  levelInCurrentPrestige: number;
}

interface HighStarPrestige {
  icon: string;
  prestigeName: string;
  colours: { value: string | number; hex: string }[];
}

interface BedwarsPrestigeFormats {
  prestige: number;
  format: MinecraftFormatting[];
  bracketColour: {
    beginning: MinecraftFormatting;
    end: MinecraftFormatting;
    star: MinecraftFormatting;
  };
}

// TODO Add all prestige names and 3100-5000 levels
const BEDWARS_PRESTIGES = [
  {
    prestige: 3000,
    prestigeName: "",
    format: [
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.GOLD,
      MinecraftFormatting.GOLD,
      MinecraftFormatting.RED,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.YELLOW,
      end: MinecraftFormatting.DARK_RED,
      star: MinecraftFormatting.DARK_RED,
    },
  },
  {
    prestige: 2900,
    format: [
      MinecraftFormatting.AQUA,
      MinecraftFormatting.DARK_AQUA,
      MinecraftFormatting.DARK_AQUA,
      MinecraftFormatting.BLUE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.AQUA,
      end: MinecraftFormatting.BLUE,
      star: MinecraftFormatting.BLUE,
    },
  },
  {
    prestige: 2800,
    format: [
      MinecraftFormatting.GREEN,
      MinecraftFormatting.DARK_GREEN,
      MinecraftFormatting.DARK_GREEN,
      MinecraftFormatting.GOLD,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GREEN,
      end: MinecraftFormatting.YELLOW,
      star: MinecraftFormatting.GOLD,
    },
  },
  {
    prestige: 2700,
    format: [
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.DARK_GRAY,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.YELLOW,
      end: MinecraftFormatting.DARK_GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 2600,
    format: [
      MinecraftFormatting.DARK_RED,
      MinecraftFormatting.RED,
      MinecraftFormatting.RED,
      MinecraftFormatting.LIGHT_PURPLE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.DARK_RED,
      end: MinecraftFormatting.DARK_PURPLE,
      star: MinecraftFormatting.LIGHT_PURPLE,
    },
  },
  {
    prestige: 2500,
    format: [
      MinecraftFormatting.WHITE,
      MinecraftFormatting.GREEN,
      MinecraftFormatting.GREEN,
      MinecraftFormatting.DARK_GREEN,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.WHITE,
      end: MinecraftFormatting.DARK_GREEN,
      star: MinecraftFormatting.DARK_GREEN,
    },
  },
  {
    prestige: 2400,
    format: [
      MinecraftFormatting.AQUA,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.GRAY,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.AQUA,
      end: MinecraftFormatting.DARK_GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 2300,
    format: [
      MinecraftFormatting.DARK_PURPLE,
      MinecraftFormatting.LIGHT_PURPLE,
      MinecraftFormatting.LIGHT_PURPLE,
      MinecraftFormatting.GOLD,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.DARK_PURPLE,
      end: MinecraftFormatting.YELLOW,
      star: MinecraftFormatting.YELLOW,
    },
  },
  {
    prestige: 2200,
    format: [
      MinecraftFormatting.GOLD,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.AQUA,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GOLD,
      end: MinecraftFormatting.DARK_AQUA,
      star: MinecraftFormatting.DARK_AQUA,
    },
  },
  {
    prestige: 2100,
    format: [
      MinecraftFormatting.WHITE,
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.GOLD,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.WHITE,
      end: MinecraftFormatting.GOLD,
      star: MinecraftFormatting.GOLD,
    },
  },
  {
    prestige: 2000,
    format: [
      MinecraftFormatting.GRAY,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.GRAY,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.DARK_GRAY,
      end: MinecraftFormatting.DARK_GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 1900,
    format: [
      MinecraftFormatting.DARK_PURPLE,
      MinecraftFormatting.DARK_PURPLE,
      MinecraftFormatting.DARK_PURPLE,
      MinecraftFormatting.DARK_PURPLE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 1800,
    format: [
      MinecraftFormatting.BLUE,
      MinecraftFormatting.BLUE,
      MinecraftFormatting.BLUE,
      MinecraftFormatting.BLUE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 1700,
    format: [
      MinecraftFormatting.LIGHT_PURPLE,
      MinecraftFormatting.LIGHT_PURPLE,
      MinecraftFormatting.LIGHT_PURPLE,
      MinecraftFormatting.LIGHT_PURPLE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_PURPLE,
    },
  },
  {
    prestige: 1600,
    format: [
      MinecraftFormatting.DARK_RED,
      MinecraftFormatting.DARK_RED,
      MinecraftFormatting.DARK_RED,
      MinecraftFormatting.DARK_RED,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_RED,
    },
  },
  {
    prestige: 1500,
    format: [
      MinecraftFormatting.DARK_AQUA,
      MinecraftFormatting.DARK_AQUA,
      MinecraftFormatting.DARK_AQUA,
      MinecraftFormatting.DARK_AQUA,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.BLUE,
    },
  },
  {
    prestige: 1400,
    format: [
      MinecraftFormatting.DARK_GREEN,
      MinecraftFormatting.DARK_GREEN,
      MinecraftFormatting.DARK_GREEN,
      MinecraftFormatting.DARK_GREEN,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_GREEN,
    },
  },
  {
    prestige: 1300,
    format: [
      MinecraftFormatting.AQUA,
      MinecraftFormatting.AQUA,
      MinecraftFormatting.AQUA,
      MinecraftFormatting.AQUA,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_AQUA,
    },
  },
  {
    prestige: 1200,
    format: [
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.YELLOW,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.GOLD,
    },
  },
  {
    prestige: 1100,
    format: [
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
      MinecraftFormatting.WHITE,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.GRAY,
      end: MinecraftFormatting.GRAY,
      star: MinecraftFormatting.DARK_GRAY,
    },
  },
  {
    prestige: 1000,
    format: [
      MinecraftFormatting.GOLD,
      MinecraftFormatting.YELLOW,
      MinecraftFormatting.GREEN,
      MinecraftFormatting.AQUA,
    ],
    bracketColour: {
      beginning: MinecraftFormatting.RED,
      end: MinecraftFormatting.DARK_PURPLE,
      star: MinecraftFormatting.LIGHT_PURPLE,
    },
  },
];

/**
 * Calculates the BedWars prestige and level of a player and returns a {@link BedwarsLevelInfoV2} interface.
 * This has been versioned as V2 to ensure backwards compatability with the older function. This function enables support for multicoloured levels above 1000.
 * @category Helper
 */
export const getBedwarsLevelInfoV2 = (
  data: BedwarsLevelInfo,
  options: { displayBrackets?: boolean; displayIcon?: boolean } = {}
) => {
  const colourFormat = BEDWARS_PRESTIGES;
  const { level, prestigeColorHex } = data;
  const { displayBrackets = false, displayIcon = false } = options;

  const highStarPrestige: HighStarPrestige = {
    icon: "✫",
    prestigeName: "",
    colours: [],
  };

  if (level >= 1100 && level < 2100) highStarPrestige.icon = "✪";
  if (level >= 2100) highStarPrestige.icon = "❀";

  if (level >= 1000) {
    colourFormat.forEach(
      ({ format, bracketColour, prestige, prestigeName }) => {
        if (prestige <= level) {
          const levelSplit = Array.from(level.toString()).map(Number);

          if (displayBrackets) {
            highStarPrestige.colours.push({
              value: "[",
              hex:
                MinecraftColorAsHex[
                  bracketColour.beginning as keyof typeof MinecraftColorAsHex
                ],
            });
          }

          for (let i = 0; i < levelSplit.length; i++) {
            highStarPrestige.colours.push({
              value: levelSplit[i],
              hex:
                MinecraftColorAsHex[
                  format[i] as keyof typeof MinecraftColorAsHex
                ],
            });
          }

          if (displayIcon) {
            highStarPrestige.colours.push({
              value: highStarPrestige.icon,
              hex:
                highStarPrestige.colours[highStarPrestige.colours.length - 1]
                  .hex,
            });
          }

          if (displayBrackets) {
            highStarPrestige.colours.push({
              value: "]",
              hex:
                MinecraftColorAsHex[
                  bracketColour.end as keyof typeof MinecraftColorAsHex
                ],
            });
          }

          highStarPrestige.prestigeName = prestigeName;
          return highStarPrestige;
        }
        return null;
      }
    );
  } else {
    if (displayBrackets) {
      highStarPrestige.colours.push({ value: "[", hex: prestigeColorHex });
    }
    highStarPrestige.colours.push({ value: level, hex: prestigeColorHex });
    if (displayIcon) {
      highStarPrestige.colours.push({
        value: highStarPrestige.icon,
        hex: prestigeColorHex,
      });
    }
    if (displayBrackets) {
      highStarPrestige.colours.push({ value: "]", hex: prestigeColorHex });
    }
    return highStarPrestige;
  }

  return {
    level,
    prestige: Math.round(level / 1000) * 10,
    prestigeName: highStarPrestige.prestigeName,
    prestigeColor: highStarPrestige.colours,
    prestigeColorHex: highStarPrestige.colours.map((colour) => colour.hex),
    levelInCurrentPrestige: data.levelInCurrentPrestige,
  };
};
