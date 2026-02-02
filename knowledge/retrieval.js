#!/usr/bin/env node
/**
 * Tiered Memory Retrieval System
 * Fetches facts based on importance scores and context window budget
 */

const fs = require('fs');
const path = require('path');

const FACTS_FILE = path.join(__dirname, 'facts.json');

// Load facts database
function loadFacts() {
  const data = fs.readFileSync(FACTS_FILE, 'utf8');
  return JSON.parse(data);
}

// Save facts database
function saveFacts(data) {
  fs.writeFileSync(FACTS_FILE, JSON.stringify(data, null, 2));
}

// Calculate current importance score with decay
function calculateImportance(fact, daysSinceAccess) {
  const { importance, access_count, created_at, last_accessed } = fact;

  // Recency boost: decays over time
  const recencyDecay = Math.max(0, 1.0 - (daysSinceAccess * 0.01));

  // Frequency multiplier: more access = higher score
  const frequencyBoost = 1.0 + (Math.log(access_count + 1) * 0.1);

  // Final score
  return importance * frequencyBoost * recencyDecay;
}

// Tier facts by importance and recency
function tierFacts(facts, contextBudget = 10000) {
  const now = new Date();
  const tier1 = [];
  const tier2 = [];
  const tier3 = [];

  facts.forEach(fact => {
    if (fact.status === 'archived') return;

    const lastAccessed = new Date(fact.last_accessed);
    const daysSince = Math.floor((now - lastAccessed) / (1000 * 60 * 60 * 24));
    const score = calculateImportance(fact, daysSince);

    // Tier 1: High importance, recent access
    if (score > 0.7 && daysSince <= 7) {
      tier1.push({ ...fact, current_score: score });
    }
    // Tier 2: Medium importance
    else if (score > 0.4 && daysSince <= 30) {
      tier2.push({ ...fact, current_score: score });
    }
    // Tier 3: Everything else
    else {
      tier3.push({ ...fact, current_score: score });
    }
  });

  // Sort each tier by current score (descending)
  tier1.sort((a, b) => b.current_score - a.current_score);
  tier2.sort((a, b) => b.current_score - a.current_score);
  tier3.sort((a, b) => b.current_score - a.current_score);

  return { tier1, tier2, tier3 };
}

// Select facts to fit context window
function selectFactsForContext(tiers, maxTokens = 10000) {
  const selected = [];
  let usedTokens = 0;

  // Helper: estimate tokens (rough approximation: 4 chars = 1 token)
  const estimateTokens = (text) => Math.ceil(JSON.stringify(text).length / 4);

  // Fill from tier 1, then tier 2, then tier 3
  for (const tier of [tiers.tier1, tiers.tier2, tiers.tier3]) {
    for (const fact of tier) {
      const tokens = estimateTokens(fact);
      if (usedTokens + tokens <= maxTokens) {
        selected.push(fact);
        usedTokens += tokens;
      }
    }
  }

  return selected;
}

// Search facts by entity or tag
function searchFacts(query, facts) {
  const q = query.toLowerCase();
  return facts.filter(fact =>
    fact.entity?.toLowerCase().includes(q) ||
    fact.fact?.toLowerCase().includes(q) ||
    fact.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

// Update fact access (increment counter, update timestamp)
function recordAccess(factId) {
  const data = loadFacts();
  const fact = data.facts.find(f => f.id === factId);

  if (fact) {
    fact.access_count = (fact.access_count || 0) + 1;
    fact.last_accessed = new Date().toISOString();
    saveFacts(data);
  }

  return fact;
}

// Add new fact
function addFact(entity, factText, source, tags = [], importance = 0.5) {
  const data = loadFacts();

  const newFact = {
    id: `fact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entity,
    fact: factText,
    source,
    created_at: new Date().toISOString(),
    last_accessed: new Date().toISOString(),
    access_count: 0,
    importance,
    status: 'active',
    tags,
    superseded_by: null
  };

  data.facts.push(newFact);
  data.metadata.total_facts++;
  data.metadata.active_facts++;
  data.metadata.last_updated = new Date().toISOString();

  // Update indexes
  if (!data.indexes.by_entity[entity]) {
    data.indexes.by_entity[entity] = [];
  }
  data.indexes.by_entity[entity].push(newFact.id);

  tags.forEach(tag => {
    if (!data.indexes.by_tag[tag]) {
      data.indexes.by_tag[tag] = [];
    }
    data.indexes.by_tag[tag].push(newFact.id);
  });

  saveFacts(data);
  return newFact;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const data = loadFacts();

  switch (command) {
    case 'list': {
      const tiers = tierFacts(data.facts);
      console.log('📊 Memory Tiers:');
      console.log(`  Tier 1 (High): ${tiers.tier1.length} facts`);
      console.log(`  Tier 2 (Medium): ${tiers.tier2.length} facts`);
      console.log(`  Tier 3 (Low): ${tiers.tier3.length} facts`);
      break;
    }

    case 'search': {
      const query = args[1];
      if (!query) {
        console.error('Usage: node retrieval.js search <query>');
        process.exit(1);
      }
      const results = searchFacts(query, data.facts);
      console.log(`🔍 Found ${results.length} facts matching "${query}":`);
      results.forEach(f => console.log(`  - [${f.entity}] ${f.fact}`));
      break;
    }

    case 'add': {
      const entity = args[1];
      const factText = args[2];
      if (!entity || !factText) {
        console.error('Usage: node retrieval.js add <entity> "<fact text>"');
        process.exit(1);
      }
      const newFact = addFact(entity, factText, 'manual', [], 0.5);
      console.log(`✅ Added fact: ${newFact.id}`);
      break;
    }

    default:
      console.log(`
Usage: node retrieval.js <command>

Commands:
  list              List facts by tier
  search <query>    Search facts
  add <entity> "<fact>"  Add new fact
      `);
  }
}

module.exports = {
  loadFacts,
  saveFacts,
  calculateImportance,
  tierFacts,
  selectFactsForContext,
  searchFacts,
  recordAccess,
  addFact
};
