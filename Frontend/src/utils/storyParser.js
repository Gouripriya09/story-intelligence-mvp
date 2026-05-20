const EPISODE_PATTERN = /episode\s*(\d+)\s*[:.\-–—]?\s*/gi;

const EMOTIONAL_KEYWORDS = [
  'love', 'hate', 'fear', 'anger', 'joy', 'sorrow', 'grief', 'rage',
  'terror', 'hope', 'despair', 'betrayal', 'conflict', 'tears', 'cry',
  'scream', 'kiss', 'death', 'murder', 'heart', 'broken', 'passion',
  'anxiety', 'panic', 'relief', 'shock', 'devastating', 'emotional',
];

const REWRITE_ACTIONS = {
  remove_character: 'Remove Character',
  kill_off: 'Kill Off Character',
  merge_characters: 'Merge Characters',
  change_allegiance: 'Change Allegiance',
  introduce_earlier: 'Introduce Earlier',
};

export { REWRITE_ACTIONS };

export function parseEpisodes(text) {
  if (!text?.trim()) return [];

  const matches = [...text.matchAll(EPISODE_PATTERN)];
  if (matches.length === 0) {
    return [{ episode: 1, content: text.trim() }];
  }

  const episodes = [];
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const chunk = text.slice(start, end).trim();
    const num = parseInt(matches[i][1], 10);
    episodes.push({ episode: num, content: chunk });
  }

  return episodes.sort((a, b) => a.episode - b.episode);
}

function emotionalScore(content) {
  const lower = content.toLowerCase();
  let hits = 0;
  for (const word of EMOTIONAL_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const found = lower.match(regex);
    if (found) hits += found.length;
  }
  const words = content.split(/\s+/).filter(Boolean).length || 1;
  const density = (hits / words) * 100;
  return Math.min(100, Math.round(density * 12 + hits * 2));
}

export function buildEmotionalIntensityData(text) {
  const episodes = parseEpisodes(text);
  return episodes.map(({ episode, content }) => ({
    episode: `Ep ${episode}`,
    intensity: emotionalScore(content),
  }));
}

export function analyzeRewriteImpact(storyText, characterName, actionKey) {
  const episodes = parseEpisodes(storyText);
  const name = characterName?.trim();
  if (!name) {
    return {
      affectedEpisodes: [],
      continuityRisk: 'low',
      brokenRelationships: [],
      suggestions: ['Select a character from your analyzed story.'],
    };
  }

  const nameRegex = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
  const affectedEpisodes = episodes
    .filter((ep) => nameRegex.test(ep.content))
    .map((ep) => ep.episode);

  const mentionCount = affectedEpisodes.length;
  const totalEpisodes = episodes.length || 1;
  const presenceRatio = mentionCount / totalEpisodes;

  let continuityRisk = 'low';
  if (presenceRatio >= 0.6 || mentionCount >= 5) continuityRisk = 'high';
  else if (presenceRatio >= 0.3 || mentionCount >= 2) continuityRisk = 'medium';

  const brokenRelationships = findRelatedNames(storyText, name, episodes, affectedEpisodes);

  const suggestions = buildSuggestions(
    actionKey,
    name,
    mentionCount,
    continuityRisk,
    brokenRelationships,
    affectedEpisodes,
  );

  if (actionKey === 'remove_character' || actionKey === 'kill_off') {
    if (continuityRisk === 'high') continuityRisk = 'high';
  }

  return {
    affectedEpisodes,
    continuityRisk,
    brokenRelationships,
    suggestions,
  };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findRelatedNames(storyText, targetName, episodes, affectedEpisodeNums) {
  const candidates = new Set();
  const properNounPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;

  for (const epNum of affectedEpisodeNums) {
    const ep = episodes.find((e) => e.episode === epNum);
    if (!ep) continue;
    let match;
    while ((match = properNounPattern.exec(ep.content)) !== null) {
      const found = match[1];
      if (found.toLowerCase() !== targetName.toLowerCase()) {
        candidates.add(found);
      }
    }
  }

  return [...candidates].slice(0, 6);
}

function buildSuggestions(actionKey, name, mentionCount, risk, relationships, affectedEpisodes) {
  const suggestions = [];
  const actionLabel = REWRITE_ACTIONS[actionKey] || 'Rewrite';

  if (mentionCount === 0) {
    suggestions.push(`${name} has minimal presence; ${actionLabel.toLowerCase()} may be low-impact.`);
    return suggestions;
  }

  switch (actionKey) {
    case 'remove_character':
      suggestions.push(`Reassign ${name}'s plot functions across ${mentionCount} episode(s) before removal.`);
      if (relationships.length) {
        suggestions.push(`Patch scenes with ${relationships.slice(0, 2).join(' and ')} to preserve continuity.`);
      }
      break;
    case 'kill_off':
      suggestions.push(`Stage ${name}'s exit with emotional payoff in their final appearing episode.`);
      if (risk === 'high') suggestions.push('Add foreshadowing 2–3 episodes earlier to avoid retention drop.');
      break;
    case 'merge_characters':
      suggestions.push(`Consolidate dialogue tags where ${name} appears in ${mentionCount} episodes.`);
      suggestions.push('Unify motivations in a single character bible entry.');
      break;
    case 'change_allegiance':
      suggestions.push(`Plant contradictory signals for ${name} in mid-season episodes.`);
      suggestions.push('Mirror the turn with an ally reaction scene.');
      break;
    case 'introduce_earlier': {
      const firstEp = affectedEpisodes.length ? Math.min(...affectedEpisodes) : 1;
      suggestions.push(`Add a brief ${name} cameo before episode ${firstEp}.`);
      suggestions.push('Echo their later role with a visual or dialogue callback.');
      break;
    }
    default:
      suggestions.push(`Review ${mentionCount} affected episode(s) for ${actionLabel.toLowerCase()}.`);
  }

  if (risk === 'high') {
    suggestions.push('Schedule a continuity pass on subplot threads tied to this character.');
  }

  return suggestions.slice(0, 4);
}
