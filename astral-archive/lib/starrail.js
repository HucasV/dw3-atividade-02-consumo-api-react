
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { StarRail } = require("starrail.js");

const globalForStarRail = globalThis;


function createClient() {
  const client = new StarRail({
    showFetchCacheLog: true,
    cacheDirectory: path.resolve(
      process.cwd(),
      "node_modules/starrail.js/cache"
    )
  });

  client.cachedAssetsManager.cacheDirectorySetup();

  return client;
}

export const starRailClient =
  globalForStarRail.__astralStarRailClient ||
  (globalForStarRail.__astralStarRailClient = createClient());

function cleanGameText(value) {
  if (typeof value !== "string") return "";

  return value
    // Converte quebras de linha literais
    .replace(/\\n/g, "\n")

    // Remove barras de escape antes de tags
    .replace(/\\([<>])/g, "$1")

    // Decodifica entidades HTML
    .replace(
      /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
      (match, entity) => {
        if (entity.startsWith("#")) {
          const number = entity[1].toLowerCase() === "x"
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10);

          return Number.isFinite(number) &&
            number >= 0 &&
            number <= 0x10ffff
            ? String.fromCodePoint(number)
            : match;
        }

        const entities = {
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
          nbsp: " "
        };

        return entities[entity.toLowerCase()] ?? match;
      }
    )

    // Remove marcações internas do jogo
    .replace(/<\/?unbreak>/gi, "")

    // Remove os símbolos de títulos Markdown
    .replace(/^#{1,6}[ \t]*/gm, "")

    .trim();
}

function textOf(asset, language = "pt") {
  if (!asset) return "";

  if (typeof asset.getNullable === "function") {
    return cleanGameText(
      asset.getNullable(language) ||
      asset.getNullable("en") ||
      ""
    );
  }

  if (typeof asset.get === "function") {
    try {
      return cleanGameText(
        asset.get(language) ||
        asset.get("en") ||
        ""
      );
    } catch {
      return "";
    }
  }

  return "";
}


function imageOf(asset) {
  return asset && asset.isAvailable ? asset.url : "";
}

export function serializeCharacter(character) {
  const rawName = textOf(character.name);
const displayName = rawName.replace(/\{NICKNAME\}/gi, "Desbravador");
  return {
    id: character.id,
    name: displayName,
    description: textOf(character.description),
    rarity: character.stars,
    path: {
      name: textOf(character.path?.name),
      icon: imageOf(character.path?.icon)
    },
    element: {
      name: textOf(character.combatType?.name),
      icon: imageOf(character.combatType?.icon)
    },
    images: {
      portrait: imageOf(character.splashImage),
      icon: imageOf(character.icon),
      side: imageOf(character.sideIcon)
    },
    skills: (character.skills || []).map((skill) => ({
      id: skill.id,
      name: textOf(skill.name),
      type: textOf(skill.skillTypeText),
      icon: imageOf(skill.skillIcon)
    })),
    eidolons: (character.eidolons || []).map((eidolon, index) => ({
      id: eidolon.id ?? index,
      name: textOf(eidolon.name),
      description: textOf(eidolon.description),
      icon: imageOf(eidolon.icon)
    }))
  };
}

export function getCharacters() {
  return starRailClient
    .getAllCharacters(true)
    .map(serializeCharacter)
    .filter((character) => character.name)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function getCharacterById(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;

  const character = starRailClient
    .getAllCharacters(true)
    .find((item) => item.id === numericId);

  return character ? serializeCharacter(character) : null;
}
export function ensureStarRailReady() {
  if (!globalForStarRail.__astralStarRailReady) {
    globalForStarRail.__astralStarRailReady = (async () => {
      console.log("Atualizando cache do StarRail.js...");

      await starRailClient.cachedAssetsManager.fetchAllContents();

      starRailClient.cachedAssetsManager.refreshAllData();

      console.log("Cache do StarRail.js atualizado!");
    })();
  }

  return globalForStarRail.__astralStarRailReady;
}

