// Action Tracker Module for Foundry VTT v14, D&D 5e v4+

Hooks.once("init", () => {
  console.log("Action Tracker | Initializing for Foundry v14, D&D 5e v4+");

  game.settings.register("action-tracker", "resetTiming", {
    name: game.i18n.localize("ACTION-TRACKER.ResetTiming"),
    hint: game.i18n.localize("ACTION-TRACKER.ResetTimingHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "turnStart": "Start of Turn",
      "turnEnd": "End of Turn",
      "roundEnd": "End of Round"
    },
    default: "turnStart"
  });

  game.settings.register("action-tracker", "iconCount", {
    name: game.i18n.localize("ACTION-TRACKER.IconCount"),
    hint: game.i18n.localize("ACTION-TRACKER.IconCountHint"),
    scope: "world",
    config: true,
    type: Number,
    range: { min: 2, max: 5, step: 1 },
    default: 3,
    onChange: value => {
      canvas.tokens.placeables.forEach(token => {
        const flags = {};
        for (let i = 0; i < value; i++) {
          flags[`action${i}`] = { used: false };
        }
        token.document.update({ flags: { "action-tracker": flags } });
      });
    }
  });

  game.settings.register("action-tracker", "removeColorWhenUsed", {
    name: game.i18n.localize("ACTION-TRACKER.RemoveColorWhenUsed"),
    hint: game.i18n.localize("ACTION-TRACKER.RemoveColorWhenUsedHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      if (game.combat && ui.combat) ui.combat.render({ force: true });
      if (canvas.hud?.token) canvas.hud.token.render({ force: true });
    }
  });

  game.settings.register("action-tracker", "enableSounds", {
    name: game.i18n.localize("ACTION-TRACKER.EnableSounds"),
    hint: game.i18n.localize("ACTION-TRACKER.EnableSoundsHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("action-tracker", "showTrackerIcons", {
    name: game.i18n.localize("ACTION-TRACKER.ShowTrackerIcons"),
    hint: game.i18n.localize("ACTION-TRACKER.ShowTrackerIconsHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      if (game.combat && ui.combat) ui.combat.render({ force: true });
    }
  });

  game.settings.register("action-tracker", "autoMarkActions", {
    name: game.i18n.localize("ACTION-TRACKER.AutoMarkActions"),
    hint: game.i18n.localize("ACTION-TRACKER.AutoMarkActionsHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("action-tracker", "showOnSheet", {
    name: game.i18n.localize("ACTION-TRACKER.ShowOnSheet"),
    hint: game.i18n.localize("ACTION-TRACKER.ShowOnSheetHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "off":    game.i18n.localize("ACTION-TRACKER.ShowOnSheetOff"),
      "combat": game.i18n.localize("ACTION-TRACKER.ShowOnSheetCombat"),
      "always": game.i18n.localize("ACTION-TRACKER.ShowOnSheetAlways")
    },
    default: "combat"
  });

  game.settings.register("action-tracker", "autoMarkMovement", {
    name: game.i18n.localize("ACTION-TRACKER.AutoMarkMovement"),
    hint: game.i18n.localize("ACTION-TRACKER.AutoMarkMovementHint"),
    scope: "world",
    config: true,
    type: String,
    choices: {
      "off":  game.i18n.localize("ACTION-TRACKER.AutoMarkMovementOff"),
      "any":  game.i18n.localize("ACTION-TRACKER.AutoMarkMovementAny"),
      "half": game.i18n.localize("ACTION-TRACKER.AutoMarkMovementHalf"),
      "full": game.i18n.localize("ACTION-TRACKER.AutoMarkMovementFull")
    },
    default: "full"
  });

  game.settings.register("action-tracker", "debug", {
    name: game.i18n.localize("ACTION-TRACKER.Debug"),
    hint: game.i18n.localize("ACTION-TRACKER.DebugHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  const defaultIcons = [
    { image: "icons/svg/combat.svg", sound: "sounds/doors/wood/lock.ogg", text: "Action", tint: "#ff0000" },
    { image: "icons/svg/upgrade.svg", sound: "sounds/doors/wood/lock.ogg", text: "Bonus Action", tint: "#00ff00" },
    { image: "icons/svg/lightning.svg", sound: "sounds/doors/wood/lock.ogg", text: "Reaction", tint: "#fff700" },
    { image: "icons/svg/wing.svg", sound: "sounds/doors/wood/lock.ogg", text: "Move", tint: "#00b3ff" },
    { image: "icons/svg/acid.svg", sound: "sounds/doors/wood/lock.ogg", text: "Interact", tint: "#ff00ff" }
  ];

  for (let i = 0; i < 5; i++) {
    const def = defaultIcons[i] || { image: "icons/svg/mystery-man.svg", sound: "sounds/doors/wood/lock.ogg", text: `Action ${i + 1}`, tint: "#ffffff" };

    game.settings.register("action-tracker", `icon${i}Image`, {
      name: game.i18n.localize(`ACTION-TRACKER.Icon${i}Image`),
      hint: game.i18n.localize(`ACTION-TRACKER.Icon${i}ImageHint`),
      scope: "world",
      config: true,
      type: String,
      default: def.image,
      filePicker: "image"
    });

    game.settings.register("action-tracker", `icon${i}Sound`, {
      name: game.i18n.localize(`ACTION-TRACKER.Icon${i}Sound`),
      hint: game.i18n.localize(`ACTION-TRACKER.Icon${i}SoundHint`),
      scope: "world",
      config: true,
      type: String,
      default: def.sound,
      filePicker: "audio"
    });

    game.settings.register("action-tracker", `icon${i}Text`, {
      name: game.i18n.localize(`ACTION-TRACKER.Icon${i}Text`),
      hint: game.i18n.localize(`ACTION-TRACKER.Icon${i}TextHint`),
      scope: "world",
      config: true,
      type: String,
      default: def.text
    });

    game.settings.register("action-tracker", `icon${i}Tint`, {
      name: game.i18n.localize(`ACTION-TRACKER.Icon${i}Tint`),
      hint: game.i18n.localize(`ACTION-TRACKER.Icon${i}TintHint`),
      scope: "world",
      config: true,
      type: String,
      default: def.tint,
      onChange: () => {
        if (game.combat && ui.combat) ui.combat.render({ force: true });
        if (canvas.hud?.token) canvas.hud.token.render({ force: true });
      }
    });
  }

  Hooks.on("renderSettingsConfig", (app, html, data) => {
    const root = html instanceof HTMLElement ? html : html[0];

    const separators = [
      { before: "action-tracker.icon0Image", title: game.i18n.localize("ACTION-TRACKER.Icon1Settings") },
      { before: "action-tracker.icon1Image", title: game.i18n.localize("ACTION-TRACKER.Icon2Settings") },
      { before: "action-tracker.icon2Image", title: game.i18n.localize("ACTION-TRACKER.Icon3Settings") },
      { before: "action-tracker.icon3Image", title: game.i18n.localize("ACTION-TRACKER.Icon4Settings") },
      { before: "action-tracker.icon4Image", title: game.i18n.localize("ACTION-TRACKER.Icon5Settings") }
    ];

    separators.forEach(sep => {
      const setting = root.querySelector(`[name="${sep.before}"]`)?.closest(".form-group");
      if (setting) {
        const h2 = document.createElement("h2");
        h2.style.cssText = "border-bottom: 1px solid #999; margin: 10px 0; padding-bottom: 5px;";
        h2.textContent = sep.title;
        setting.before(h2);
      }
    });

    for (let i = 0; i < 5; i++) {
      const tintInput = root.querySelector(`[name="action-tracker.icon${i}Tint"]`);
      if (tintInput) {
        const value = game.settings.get("action-tracker", `icon${i}Tint`);
        const wrapper = document.createElement("span");
        wrapper.innerHTML = `<color-picker name="action-tracker.icon${i}Tint" value="${value}"><input type="text" placeholder=""><input type="color"></color-picker>`;
        tintInput.replaceWith(wrapper.firstElementChild);
      }
    }
  });

  Hooks.once("ready", () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "modules/action-tracker/action-tracker.css";
    document.head.appendChild(link);
    if (game.settings.get("action-tracker", "debug")) {
      console.log("Action Tracker | CSS forced load");
    }
  });
});

// Play a sound in a way compatible with both v13 and v14
function playSound(src) {
  const Helper = foundry.audio?.AudioHelper ?? AudioHelper;
  Helper?.play({ src, volume: 0.5 });
}

// SVG caching for performance
const svgCache = new Map();

// Cumulative feet moved per token this turn, keyed by TokenDocument id
const tokenMovementMap = new Map();

// Last confirmed pixel position per token, keyed by TokenDocument id.
// Initialised at turn start (reliable) and updated on every move.
const tokenLastKnownPosition = new Map();

function isSvgImage(image) {
  return String(image ?? "").split(/[?#]/)[0].toLowerCase().endsWith(".svg");
}

function createFallbackSvg(tint) {
  const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", "16");
  rect.setAttribute("height", "16");
  rect.setAttribute("fill", tint);
  fallback.appendChild(rect);
  return fallback;
}

function applyIconColor(icon, tint, used, removeColor) {
  const color = used && removeColor ? "#ffffff" : tint;
  if (icon.style) icon.style.borderColor = color;
  icon.querySelectorAll?.("path, circle, rect").forEach(el => {
    el.setAttribute("fill", color);
  });
}

async function getIconElement(image, tint, used, removeColor, size = "20px") {
  if (!isSvgImage(image)) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.setAttribute("width", size);
    img.setAttribute("height", size);
    img.classList.toggle("used", used);
    applyIconColor(img, tint, used, removeColor);
    return img;
  }

  if (!svgCache.has(image)) {
    try {
      const response = await fetch(image);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svg = svgDoc.documentElement;
      if (svg?.tagName?.toLowerCase() !== "svg") throw new Error("Icon is not an SVG");
      svgCache.set(image, svg.cloneNode(true));
    } catch (e) {
      if (game.settings.get("action-tracker", "debug")) {
        console.warn(`Action Tracker | Failed to load icon (${image}) - using fallback`, e);
      }
      svgCache.set(image, createFallbackSvg(tint));
    }
  }
  const icon = svgCache.get(image).cloneNode(true);
  icon.setAttribute("width", size);
  icon.setAttribute("height", size);
  icon.classList.toggle("used", used);
  applyIconColor(icon, tint, used, removeColor);
  return icon;
}

Hooks.on("preCreateToken", (tokenDoc, data, options, userId) => {
  const iconCount = game.settings.get("action-tracker", "iconCount");
  const flags = {};
  for (let i = 0; i < iconCount; i++) {
    flags[`action${i}`] = { used: false };
  }
  tokenDoc.updateSource({ flags: { "action-tracker": flags } });
});

Hooks.on("updateToken", async (tokenDoc, updates, options, userId) => {
  if (updates.flags?.["action-tracker"]) {
    refreshTokenDisplays(tokenDoc);
  }

  if (updates.x !== undefined || updates.y !== undefined) {
    const prev = tokenLastKnownPosition.get(tokenDoc.id);
    const next = {
      x: updates.x ?? tokenDoc.x,
      y: updates.y ?? tokenDoc.y
    };
    tokenLastKnownPosition.set(tokenDoc.id, next);
    if (prev) {
      const segDist = getSegmentDistance(prev.x, prev.y, next.x, next.y);
      const total = (tokenMovementMap.get(tokenDoc.id) ?? 0) + segDist;
      tokenMovementMap.set(tokenDoc.id, total);
      await trackTokenMovement(tokenDoc, total);
    }
  }
});

Hooks.on("renderTokenHUD", async (hud, html, data) => {
  const root = html instanceof HTMLElement ? html : html[0];
  const token = hud.object;
  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | Rendering HUD for ${token.name}`);
  }

  const inCombat = game.combat?.combatants.some(c => c.tokenId === token.id);
  if (!inCombat) {
    if (game.settings.get("action-tracker", "debug")) {
      console.log(`Action Tracker | ${token.name} not in combat - skipping icons`);
    }
    return;
  }

  const actionBar = document.createElement("div");
  actionBar.className = "action-tracker";

  const iconCount = game.settings.get("action-tracker", "iconCount");
  const enableSounds = game.settings.get("action-tracker", "enableSounds");
  const removeColor = game.settings.get("action-tracker", "removeColorWhenUsed");

  for (let i = 0; i < iconCount; i++) {
    const image = game.settings.get("action-tracker", `icon${i}Image`);
    const text = game.settings.get("action-tracker", `icon${i}Text`);
    const sound = game.settings.get("action-tracker", `icon${i}Sound`);
    let tint = game.settings.get("action-tracker", `icon${i}Tint`);
    const used = token.document.getFlag("action-tracker", `action${i}`)?.used || false;

    if (!tint.match(/^#[0-9A-Fa-f]{6}$/)) tint = "#ffffff";

    const dotWrapper = document.createElement("div");
    dotWrapper.className = "action-dot-wrapper";

    const svgElement = await getIconElement(image, tint, used, removeColor);

    const tooltip = document.createElement("span");
    tooltip.className = "action-tooltip";
    tooltip.textContent = text;
    dotWrapper.appendChild(svgElement);
    dotWrapper.appendChild(tooltip);

    dotWrapper.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (game.settings.get("action-tracker", "debug")) {
        console.log(`Action Tracker | Clicked HUD dot ${i} for ${token.name}`);
      }
      const newState = !used;
      await token.document.setFlag("action-tracker", `action${i}.used`, newState);
      svgElement.classList.toggle("used", newState);
      if (removeColor) {
        applyIconColor(svgElement, tint, newState, removeColor);
      }
      if (enableSounds) playSound(sound);
      if (game.combat && ui.combat) ui.combat.render({ force: true });
      if (canvas.hud?.token?.object === token) canvas.hud.token.render({ force: true });
    });

    dotWrapper.addEventListener("mouseover", () => {
      svgElement.style.transform = "scale(1.2)";
    });
    dotWrapper.addEventListener("mouseout", () => {
      svgElement.style.transform = "scale(1)";
    });

    actionBar.appendChild(dotWrapper);
  }

  const middleCol = root.querySelector(".col.middle");
  if (middleCol) {
    middleCol.prepend(actionBar);
    if (game.settings.get("action-tracker", "debug")) {
      console.log(`Action Tracker | Action bar prepended to middle column`);
    }
  } else {
    if (game.settings.get("action-tracker", "debug")) {
      console.warn(`Action Tracker | Middle column not found, appending to root`);
    }
    root.prepend(actionBar);
  }
});

function getIconState(combatant, actionIndex) {
  let tokenDoc;
  if (combatant.token) {
    tokenDoc = combatant.token;
  } else {
    const token = canvas.tokens.get(combatant.tokenId);
    tokenDoc = token?.document;
  }
  if (!tokenDoc) {
    if (game.settings.get("action-tracker", "debug")) {
      console.warn(`Action Tracker | No token document for combatant ${combatant.id || combatant.name || "unknown"}`);
    }
    return { used: false };
  }
  return tokenDoc.getFlag("action-tracker", `action${actionIndex}`) || { used: false };
}

Hooks.on("renderCombatTracker", async (tracker, html, data) => {
  if (game.settings.get("action-tracker", "debug")) {
    console.log("Action Tracker | Rendering Combat Tracker");
  }

  // Support both AppV1 context (data.combat) and AppV2 (tracker.viewed)
  const combat = data?.combat ?? tracker.viewed ?? game.combat;
  if (!combat) {
    if (game.settings.get("action-tracker", "debug")) {
      console.log("Action Tracker | No active combat - skipping tracker icons");
    }
    return;
  }

  const showTrackerIcons = game.settings.get("action-tracker", "showTrackerIcons");
  if (!showTrackerIcons) {
    if (game.settings.get("action-tracker", "debug")) {
      console.log("Action Tracker | Tracker icons disabled in settings - skipping");
    }
    return;
  }

  const root = html instanceof HTMLElement ? html : html[0];
  const iconCount = game.settings.get("action-tracker", "iconCount");
  const removeColor = game.settings.get("action-tracker", "removeColorWhenUsed");
  const enableSounds = game.settings.get("action-tracker", "enableSounds");

  for (const combatant of combat.combatants) {
    if (!combatant?.tokenId) {
      if (game.settings.get("action-tracker", "debug")) {
        console.warn(`Action Tracker | Combatant ${combatant?.name || "unknown"} has no tokenId - skipping`);
      }
      continue;
    }

    const combatantLi = root.querySelector(`li.combatant[data-combatant-id="${combatant.id}"]`);
    if (!combatantLi) {
      if (game.settings.get("action-tracker", "debug")) {
        console.warn(`Action Tracker | No LI found for combatant ${combatant.id}`);
      }
      continue;
    }

    const nameElement = combatantLi.querySelector(".token-name") ?? combatantLi.querySelector(".combatant-name");
    if (!nameElement) {
      if (game.settings.get("action-tracker", "debug")) {
        console.warn(`Action Tracker | No .token-name found for combatant ${combatant.id}`);
      }
      continue;
    }

    const existingIconBar = combatantLi.querySelector(".action-tracker-icons");
    if (existingIconBar) existingIconBar.remove();

    const iconBar = document.createElement("div");
    iconBar.className = "action-tracker-icons";

    for (let i = 0; i < iconCount; i++) {
      const image = game.settings.get("action-tracker", `icon${i}Image`);
      const text = game.settings.get("action-tracker", `icon${i}Text`);
      const sound = game.settings.get("action-tracker", `icon${i}Sound`);
      let tint = game.settings.get("action-tracker", `icon${i}Tint`);
      const { used } = getIconState(combatant, i);

      if (!tint.match(/^#[0-9A-Fa-f]{6}$/)) tint = "#ffffff";

      const svgElement = await getIconElement(image, tint, used, removeColor, "16px");

      const wrapper = document.createElement("div");
      wrapper.className = "action-dot-wrapper-tracker";
      wrapper.style.cursor = "pointer";
      wrapper.setAttribute("data-tooltip", text);
      wrapper.appendChild(svgElement);

      wrapper.addEventListener("click", async (event) => {
        event.stopPropagation();
        event.preventDefault();
        const tokenDoc = combatant.token ?? canvas.tokens.get(combatant.tokenId)?.document;
        if (!tokenDoc) {
          if (game.settings.get("action-tracker", "debug")) {
            console.warn(`Action Tracker | No token document for ${combatant.name || combatant.id} on click`);
          }
          return;
        }
        if (game.settings.get("action-tracker", "debug")) {
          console.log(`Action Tracker | Clicked tracker dot ${i} for ${tokenDoc.name}`);
        }
        const newState = !used;
        await tokenDoc.setFlag("action-tracker", `action${i}.used`, newState);
        svgElement.classList.toggle("used", newState);
        if (removeColor) {
          applyIconColor(svgElement, tint, newState, removeColor);
        }
        if (enableSounds) playSound(sound);
        if (game.combat && ui.combat) ui.combat.render({ force: true });
      });

      iconBar.appendChild(wrapper);
    }

    nameElement.after(iconBar);
  }
});

function getTokenDocForSheet(actor, setting) {
  if (game.combat) {
    const combatant = game.combat.combatants.find(c => c.actor === actor);
    if (combatant?.token) return combatant.token;
  }
  if (setting !== "always") return null;
  return actor.getActiveTokens(false, false)[0]?.document ?? null;
}

async function renderActorSheetHandler(sheet, html, data) {
  const setting = game.settings.get("action-tracker", "showOnSheet");
  if (setting === "off") return;

  const actor = sheet.actor ?? sheet.document;
  if (!(actor instanceof Actor)) return;

  const tokenDoc = getTokenDocForSheet(actor, setting);
  if (!tokenDoc) return;

  const root = html instanceof HTMLElement ? html : html[0];

  // Try common dnd5e selectors for the HP section; log what we find in debug mode
  const hpSection = root.querySelector(".hit-points")
    ?? root.querySelector("[class*='hit-points']")
    ?? root.querySelector(".attribute.hit-points")
    ?? root.querySelector(".hp");

  if (!hpSection) {
    if (game.settings.get("action-tracker", "debug")) {
      console.warn(`Action Tracker | Could not find HP section on ${sheet.constructor.name} — enable debug and check the sheet HTML`);
    }
    return;
  }

  root.querySelector(".action-tracker-sheet")?.remove();

  const iconCount = game.settings.get("action-tracker", "iconCount");
  const removeColor = game.settings.get("action-tracker", "removeColorWhenUsed");
  const enableSounds = game.settings.get("action-tracker", "enableSounds");

  const container = document.createElement("div");
  container.className = "action-tracker-sheet";

  for (let i = 0; i < iconCount; i++) {
    const image = game.settings.get("action-tracker", `icon${i}Image`);
    const text = game.settings.get("action-tracker", `icon${i}Text`);
    const sound = game.settings.get("action-tracker", `icon${i}Sound`);
    let tint = game.settings.get("action-tracker", `icon${i}Tint`);
    const used = tokenDoc.getFlag("action-tracker", `action${i}`)?.used || false;

    if (!tint.match(/^#[0-9A-Fa-f]{6}$/)) tint = "#ffffff";

    const svgElement = await getIconElement(image, tint, used, removeColor);

    const dotWrapper = document.createElement("div");
    dotWrapper.className = "action-dot-wrapper-sheet";
    dotWrapper.setAttribute("data-tooltip", text);
    dotWrapper.appendChild(svgElement);

    dotWrapper.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();
      const newState = !used;
      await tokenDoc.setFlag("action-tracker", `action${i}.used`, newState);
      if (enableSounds) playSound(sound);
    });

    container.appendChild(dotWrapper);
  }

  // Walk up one level so the icons appear above the "HIT POINTS" label as well,
  // not just above the bar inside the section.
  const insertTarget = (hpSection.parentElement && hpSection.parentElement !== root)
    ? hpSection.parentElement
    : hpSection;
  insertTarget.before(container);
}

Hooks.on("createCombat", (combat) => {
  seedCombatantPositions(combat);
});

Hooks.on("combatStart", (combat) => {
  seedCombatantPositions(combat);
});

Hooks.on("updateCombat", async (combat, update, options, userId) => {
  const resetTiming = game.settings.get("action-tracker", "resetTiming");

  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | updateCombat: turn: ${update.turn}, round: ${update.round}`);
  }

  // Seed movement tracking whenever turn state changes. Seeding all combatants
  // makes the first movement reliable even for out-of-turn movement.
  if (update.turn !== undefined || update.round !== undefined) {
    seedCombatantPositions(combat);
  }

  if (resetTiming === "turnStart" && update.turn !== undefined) {
    const currentToken = combat.combatant?.token?.object;
    if (currentToken?.document) await resetActions(currentToken);
    else if (game.settings.get("action-tracker", "debug")) {
      console.warn("Action Tracker | No valid current token for turnStart reset");
    }
  } else if (resetTiming === "turnEnd" && update.turn !== undefined) {
    // Resolve the previous combatant via combat.turns (sorted initiative order)
    const prevTurnIndex = combat.previous?.turn;
    const previousCombatant = prevTurnIndex !== undefined ? combat.turns?.[prevTurnIndex] : null;
    const previousToken = previousCombatant?.token?.object
      ?? (previousCombatant ? canvas.tokens.get(previousCombatant.tokenId) : null);
    if (previousToken?.document) await resetActions(previousToken);
    else if (game.settings.get("action-tracker", "debug")) {
      console.warn("Action Tracker | No valid previous token for turnEnd reset");
    }
  } else if (resetTiming === "roundEnd" && update.round !== undefined && update.turn === 0) {
    await Promise.all(combat.combatants.map(c => {
      const token = c.token?.object ?? canvas.tokens.get(c.tokenId);
      if (token?.document) return resetActions(token);
      else if (game.settings.get("action-tracker", "debug")) {
        console.warn(`Action Tracker | Invalid token in combatant: ${c.name}`);
      }
    }));
  }
});

function seedCombatantPositions(combat) {
  if (!combat?.combatants) return;
  combat.combatants.forEach(seedCombatantPosition);
}

function seedCombatantPosition(combatant) {
  const tokenDoc = combatant?.token ?? canvas.tokens.get(combatant?.tokenId)?.document;
  if (!combatant?.tokenId || !tokenDoc) return;

  tokenLastKnownPosition.set(combatant.tokenId, { x: tokenDoc.x, y: tokenDoc.y });

  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | Seeded movement position for ${combatant.name}`);
  }
}

Hooks.on("deleteCombat", async (combat, options, userId) => {
  if (game.settings.get("action-tracker", "debug")) {
    console.log("Action Tracker | Combat ended - resetting all icons");
  }
  await Promise.all(combat.combatants.map(c => {
    const token = c.token?.object ?? canvas.tokens.get(c.tokenId);
    if (token?.document) return resetActions(token);
    else if (game.settings.get("action-tracker", "debug")) {
      console.warn(`Action Tracker | No token found for combatant ${c.name} on combat end`);
    }
  }));
  tokenMovementMap.clear();
  tokenLastKnownPosition.clear();
});

async function resetActions(token) {
  const iconCount = game.settings.get("action-tracker", "iconCount");
  const flags = {};
  for (let i = 0; i < iconCount; i++) {
    flags[`action${i}`] = { used: false };
  }
  await token.document.update({ flags: { "action-tracker": flags } });
  tokenMovementMap.delete(token.document.id);
  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | Reset icons for ${token.name}`);
  }
  if (game.combat && ui.combat) ui.combat.render({ force: true });
  if (canvas.hud?.token?.object === token) canvas.hud.token.render({ force: true });
}

function getSegmentDistance(prevX, prevY, newX, newY) {
  const dx = newX - prevX;
  const dy = newY - prevY;
  const pixels = Math.sqrt(dx * dx + dy * dy);
  return (pixels / canvas.grid.size) * canvas.scene.grid.distance;
}

async function trackTokenMovement(tokenDoc, totalFeet) {
  const setting = game.settings.get("action-tracker", "autoMarkMovement");
  if (setting === "off") return;
  if (!game.combat) return;
  if (!game.combat.combatants.some(c => c.tokenId === tokenDoc.id)) return;

  const moveIconIndex = 3;
  if (moveIconIndex >= game.settings.get("action-tracker", "iconCount")) return;

  const alreadyUsed = tokenDoc.getFlag("action-tracker", `action${moveIconIndex}`)?.used;
  if (alreadyUsed) return;

  const walkSpeed = tokenDoc.actor?.system?.attributes?.movement?.walk ?? 30;
  const threshold = setting === "any" ? 0 : setting === "half" ? walkSpeed / 2 : walkSpeed;

  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | Movement check: ${totalFeet.toFixed(1)}ft moved, threshold ${threshold}ft for ${tokenDoc.name}`);
  }

  const reachedThreshold = setting === "any"
    ? totalFeet > 0
    : totalFeet + 0.001 >= threshold;

  if (reachedThreshold) {
    await tokenDoc.setFlag("action-tracker", `action${moveIconIndex}.used`, true);
    refreshTokenDisplays(tokenDoc);
  }
}

function refreshTokenDisplays(tokenDoc) {
  if (game.combat && ui.combat) ui.combat.render({ force: true });
  if (canvas.hud?.token?.object?.document?.id === tokenDoc.id) {
    canvas.hud.token.render({ force: true });
  }
  if (game.settings.get("action-tracker", "showOnSheet") !== "off" && tokenDoc.actor?.sheet?.rendered) {
    tokenDoc.actor.sheet.render({ force: true });
  }
}

// Map DnD5e activation types to icon indices (matches default icon order)
function getIconIndexForActivationType(type) {
  switch (type) {
    case "action": return 0;
    case "bonus": return 1;
    case "reaction": return 2;
    default: return -1;
  }
}

// Find the TokenDocument for an actor, preferring the one in active combat
function getTokenDocForActor(actor) {
  if (game.combat) {
    const combatant = game.combat.combatants.find(c => c.actor === actor);
    if (combatant?.token) return combatant.token;
  }
  return actor.getActiveTokens(false, false)[0]?.document ?? null;
}

async function autoMarkActionForToken(tokenDoc, activationType) {
  if (!game.settings.get("action-tracker", "autoMarkActions")) return;
  const inCombat = game.combat?.combatants.some(c => c.tokenId === tokenDoc.id);
  if (!inCombat) return;
  const iconIndex = getIconIndexForActivationType(activationType);
  if (iconIndex < 0) return;
  const iconCount = game.settings.get("action-tracker", "iconCount");
  if (iconIndex >= iconCount) return;
  const alreadyUsed = tokenDoc.getFlag("action-tracker", `action${iconIndex}`)?.used;
  if (alreadyUsed) return;
  if (game.settings.get("action-tracker", "debug")) {
    console.log(`Action Tracker | Auto-marking ${activationType} (icon ${iconIndex}) for ${tokenDoc.name}`);
  }
  await tokenDoc.setFlag("action-tracker", `action${iconIndex}.used`, true);
}

// Register auto-marking and sheet hooks after all modules/sheets are loaded
Hooks.once("ready", () => {
  // Register renderActorSheetHandler for every actor sheet type registered in CONFIG.
  // We can't use "renderActorSheet" because Foundry v14 ApplicationV2 sheets only fire
  // hooks named after their exact class (e.g. "renderActorSheet5eCharacter"), not parent classes.
  const seenClasses = new Set();
  const debug = game.settings.get("action-tracker", "debug");
  for (const tierSheets of Object.values(CONFIG.Actor.sheetClasses ?? {})) {
    for (const config of Object.values(tierSheets)) {
      const name = config?.cls?.name;
      if (name && !seenClasses.has(name)) {
        seenClasses.add(name);
        Hooks.on(`render${name}`, renderActorSheetHandler);
        if (debug) console.log(`Action Tracker | Registered sheet hook: render${name}`);
      }
    }
  }
  // Legacy catch-all for any AppV1 sheet not covered above
  Hooks.on("renderActorSheet", renderActorSheetHandler);

  if (game.modules.get("midi-qol")?.active) {
    if (game.settings.get("action-tracker", "debug")) {
      console.log("Action Tracker | MIDI-QOL detected - using midi-qol.RollComplete for auto-marking");
    }
    Hooks.on("midi-qol.RollComplete", (workflow) => {
      // workflow.token may be a Token object or a TokenDocument
      const tokenDoc = workflow.token?.document ?? workflow.token;
      if (!tokenDoc) return;
      const activationType = workflow.activity?.activation?.type ?? workflow.item?.system?.activation?.type;
      autoMarkActionForToken(tokenDoc, activationType);
    });
  } else {
    if (game.settings.get("action-tracker", "debug")) {
      console.log("Action Tracker | Using dnd5e.postUseActivity for auto-marking");
    }
    Hooks.on("dnd5e.postUseActivity", (activity, usageConfig, results) => {
      const actor = activity.actor;
      if (!actor) return;
      const activationType = activity.activation?.type ?? activity.item?.system?.activation?.type;
      const tokenDoc = getTokenDocForActor(actor);
      if (!tokenDoc) return;
      autoMarkActionForToken(tokenDoc, activationType);
    });
  }
});

function hueFromHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  if (max === min) h = 0;
  else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
  else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
  else h = 60 * ((r - g) / (max - min)) + 240;
  return h;
}
