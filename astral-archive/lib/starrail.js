
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { StarRail, SkillLevel } = require("starrail.js");

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

// Cliente inicializado primeiro
export const starRailClient =
  globalForStarRail.__astralStarRailClient ||
  (globalForStarRail.__astralStarRailClient = createClient());

// Diagnóstico depois da inicialização
console.log(
  "FONTES DE IMAGENS CONFIGURADAS:",
  (starRailClient.options?.imageBaseUrls ?? []).map((source) => ({
    url: source.url,
    filePath: source.filePath,
    format: source.format,
    priority: source.priority,
    regexList: source.regexList?.map((regex) => regex.toString()) ?? []
  }))
);




function cleanGameText(value) {
  if (typeof value !== "string") return "";

  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " "
  };

  return value
    .replace(/\\n/g, "\n")
    .replace(/\\([<>])/g, "$1")
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

        return entities[entity.toLowerCase()] ?? match;
      }
    )
    // Remove marcações de cor do jogo
    .replace(/<color=[^>]*>/gi, "")
    .replace(/<\/color>/gi, "")
    // Remove outras tags de formatação
    .replace(/<size=[^>]*>/gi, "")
    .replace(/<\/size>/gi, "")
    .replace(/<i>/gi, "")
    .replace(/<\/i>/gi, "")
    .replace(/<\/?unbreak>/gi, "")
    .replace(/^#{1,6}[ \t]\*/gm, "")
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

function getCharacterBaseStats(character) {
  try {
    const stats = character.getStatsByLevel(6, 80);

    const findStat = (...types) => {
      const stat = stats.find((item) =>
        types.includes(item.type)
      );

      if (!stat) return null;

      return {
        value: stat.value,
        text: stat.valueText
      };
    };

    return {
      level: 80,
      ascension: 6,

      hp: findStat("MaxHP", "BaseHP"),
      attack: findStat("Attack", "BaseAttack"),
      defense: findStat("Defence", "BaseDefence"),
      speed: findStat("Speed", "BaseSpeed")
    };
  } catch (error) {
    console.error(
      "Erro ao consultar atributos do personagem:",
      error
    );

    return null;
  }
}

function dynamicTextOf(asset, params = []) {
  if (!asset) return "";

  try {
    if (
      typeof asset.getNullableReplacedText === "function"
    ) {
      return cleanGameText(
        asset.getNullableReplacedText(params, "pt") ||
        asset.getNullableReplacedText(params, "en") ||
        ""
      );
    }

    return textOf(asset);
  } catch {
    return "";
  }
}


function normalizeName(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[•·]/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const SIGNATURE_LIGHT_CONES = {
  // Personagens permanentes
  "bailu": "Time Waits for No One",
  "bronya": "But the Battle Isn't Over",
  "clara": "Something Irreplaceable",
  "gepard": "Moment of Victory",
  "himeko": "Night on the Milky Way",
  "welt": "In the Name of the World",
  "yanqing": "Sleep Like the Dead",

  // Personagens limitados
  "seele": "In the Night",
  "jing yuan": "Before Dawn",
  "silver wolf": "Incessant Rain",
  "luocha": "Echoes of the Coffin",
  "blade": "The Unreachable Side",
  "kafka": "Patience Is All You Need",
  "dan heng imbibitor lunae": "Brighter Than the Sun",
  "fu xuan": "She Already Shut Her Eyes",
  "jingliu": "I Shall Be My Own Sword",
  "topaz numby": "Worrisome, Blissful",
  "huohuo": "Night of Fright",
  "argenti": "An Instant Before A Gaze",
  "ruan mei": "Past Self in Mirror",
  "dr ratio": "Baptism of Pure Thought",
  "black swan": "Reforged Remembrance",
  "sparkle": "Earthly Escapade",
  "acheron": "Along the Passing Shore",
  "aventurine": "Inherently Unjust Destiny",
  "robin": "Flowing Nightglow",
  "boothill": "Sailing Towards a Second Life",
  "firefly": "Whereabouts Should Dreams Rest",
  "jade": "Yet Hope Is Priceless",
  "yunli": "Dance at Sunset",
  "jiaoqiu": "Those Many Springs",
  "feixiao": "I Venture Forth to Hunt",
  "lingsha": "Scent Alone Stays True",
  "rappa": "Ninjutsu Inscription: Dazzling Evilbreaker",
  "sunday": "A Grounded Ascent",
  "fugue": "Long Road Leads Home",
  "the herta": "Into the Unreachable Veil",
  "aglaea": "Time Woven Into Gold",
  "tribbie": "If Time Were a Flower",
  "mydei": "Flame of Blood, Blaze My Path",
  "anaxa": "Life Should Be Cast to Flames",
  "castorice": "Make Farewells More Beautiful",
  "cipher": "Lies Dance on the Breeze",
  "phainon": "Thus Burns the Dawn",
  "hyacine": "Long May Rainbows Adorn the Sky",
  "hysilens": "Why Does the Ocean Sing",
  "cerydra": "Epoch Etched in Golden Blood",
  "evernight": "To Evernight's Stars",

  // Outras formas e personagens
  "dan heng permansor terrae": "Though Worlds Apart",
  "the dahlia": "Never Forget Her Flame",
  "pearl": "Colors for Tomorrow",
  "ashveil": "The Finale of a Lie",
  "evanescia": "Until the Flowers Bloom Again",
  "mortenax blade": "Reforged in Hellfire",
  "aventurine waveflair": "Summer Rides the Surf",
  "robin summeretto": "Rise and Sing",
  "himeko nova": "A Star That Lights the Night",
  "gilgamesh": "I Am As You Behold",
  "rin tohsaka": "Flickering Stars",
  "archer": "The Hell Where Ideals Burn",
  "saber": "A Thankless Coronation",
  "silver wolf lv 999": "Welcome to the Cosmic City",
  "yao guang": "When She Decided to See",
  "sparxie": "Dazzled by a Flowery World",
  "aeon aha": "Upon the First Echo of \"Aha\"",
  "aha": "Upon the First Echo of \"Aha\"",
  "cyrene": "This Love, Forever"
};



function serializeLightCone(lightCone) {
  const stats = lightCone.getStatsByLevel(6, 80);

  const findStat = (...types) => {
    const stat = stats.find((item) =>
      types.includes(item.type)
    );

    if (!stat) return null;

    return {
      value: stat.value,
      text: stat.valueText
    };
  };

  const superimpositions = (
    lightCone.superimpositions || []
  ).map((item, index) => ({
    rank: item.level ?? index + 1,
    effectName: textOf(item.name),
    description: dynamicTextOf(
      item.description,
      item.paramList || []
    )
  }));

  const firstEffect = superimpositions[0];

  return {
    id: lightCone.id,
    name: textOf(lightCone.name),
    rarity: lightCone.stars,
    path: textOf(lightCone.path?.name),

    image:
      imageOf(lightCone.cardImage) ||
      imageOf(lightCone.icon),

    // ATRIBUTOS NO NÍVEL 80
    stats: {
      level: 80,
      ascension: 6,
      hp: findStat("BaseHP", "MaxHP"),
      attack: findStat("BaseAttack", "Attack"),
      defense: findStat("BaseDefence", "Defence")
    },

    // EFEITO
    effectName: firstEffect?.effectName || "",
    description: firstEffect?.description || "",

    // SUPERIMPOSIÇÕES
    superimpositions,

    maxSuperimposition:
      lightCone.maxSuperimposition
  };
}

function getSignatureLightCone(character, lightCones) {
  if (Number(character.stars) !== 5) {
    return null;
  }

  const characterName = normalizeName(
    textOf(character.name, "en")
  );

  const signatureName =
    SIGNATURE_LIGHT_CONES[characterName];

  if (!signatureName) {
    return null;
  }

  const signature = lightCones.find(
    (cone) =>
      normalizeName(textOf(cone.name, "en")) ===
      normalizeName(signatureName)
  );

  if (!signature) {
    console.warn(
      "Cone assinatura não encontrado:",
      characterName,
      "->",
      signatureName
    );

    return null;
  }

  return serializeLightCone(signature);
}



export function serializeCharacter(
  character,
  lightCones = []
) {
  const rawName = textOf(character.name);
  const displayName = rawName.replace(
    /\{NICKNAME\}/gi,
    "Desbravador"
  );

  return {
    id: character.id,
    name: displayName,
    description: textOf(character.description),
    rarity: character.stars,

    baseStats: getCharacterBaseStats(character),

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

    // CONE DE LUZ ASSINATURA
    signatureLightCone: getSignatureLightCone(
      character,
      lightCones
    ),

    // HABILIDADES
    skills: (character.skills || []).map((skill) => {
      let leveledSkill = null;

      try {
        leveledSkill = skill.getSkillByLevel(
          new SkillLevel(skill.maxLevel || 1, 0)
        );
      } catch (error) {
        console.error(
          "Erro ao carregar habilidade:",
          skill.id,
          error
        );
      }

      const descriptionAsset =
        leveledSkill?.description ||
        leveledSkill?.simpleDescription;

      const parameters =
        leveledSkill?.paramList ||
        leveledSkill?.simpleParamList ||
        [];

      return {
        id: skill.id,
        name: textOf(skill.name),

        type:
          textOf(skill.skillTypeText) ||
          textOf(skill.effectTypeText),

        icon:
          imageOf(skill.skillIcon) ||
          imageOf(skill.ultraSkillIcon),

        description: dynamicTextOf(
          descriptionAsset,
          parameters
        ),

        level: leveledSkill?.level?.value ?? null,
        maxLevel: skill.maxLevel
      };
    }),

    // EIDOLONS
    eidolons: (character.eidolons || []).map(
      (eidolon, index) => {
        const picture = imageOf(eidolon.picture);
        const icon = imageOf(eidolon.icon);

        return {
          id: eidolon.id ?? index,
          rank: eidolon.rank ?? index + 1,
          name: textOf(eidolon.name),
          description: textOf(eidolon.description),
          image: picture || icon
        };
      }
    )
  };
}




export function getCharacters() {
  const lightCones = starRailClient.getAllLightCones(true);

  return starRailClient
    .getAllCharacters(true)
    .map((character) =>
      serializeCharacter(character, lightCones)
    )
    .filter((character) => character.name)
    .sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );
}

export function getCharacterById(id) {
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }

  const character = starRailClient
    .getAllCharacters(true)
    .find((item) => item.id === numericId);

  if (!character) return null;

  const lightCones = starRailClient.getAllLightCones(true);

  return serializeCharacter(character, lightCones);
}

export function ensureStarRailReady() {
  if (!globalForStarRail.__astralStarRailReady) {
    globalForStarRail.__astralStarRailReady = (async () => {
      console.log("Atualizando cache do StarRail.js...");

      await starRailClient.cachedAssetsManager.fetchAllContents();

      starRailClient.cachedAssetsManager.refreshAllData();

      const testCharacter = starRailClient
  .getAllCharacters(true)
  .find((character) => character.id === 1402);

console.log(
  "TESTE EIDOLON PICTURE:",
  testCharacter?.eidolons?.[0]?.picture
);

      console.log("Cache do StarRail.js atualizado!");
    })();
  }

  return globalForStarRail.__astralStarRailReady;
}

