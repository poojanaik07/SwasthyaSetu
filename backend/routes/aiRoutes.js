const express = require('express');
const router = express.Router();

/**
 * AI Symptom Checker Backend Proxy
 * Incorporates logic provided by the user for Claude API calls and Mock Fallbacks.
 */

const API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Generates dynamic mock content based on the user's prompt (extracts symptoms & age)
 */
function generateMockAnalysis(prompt) {
  const isChat = prompt.includes("Conversation");

  if (isChat) return "I understand. Please monitor your symptoms closely. If they worsen, or you feel severe discomfort, please visit the nearest medical facility immediately.";

  // Rough extraction for the demo
  const symMatch = prompt.match(/Patient symptoms: "(.*?)"/i);
  const ageMatch = prompt.match(/Patient age: (\d+)/i);
  const symptoms = symMatch ? symMatch[1] : "these symptoms";
  const age = ageMatch ? parseInt(ageMatch[1]) : 30;

  let urgency = "LOW";
  let condition = "Viral infection, fatigue, or mild reaction.";
  let tips = "Rest completely.\nKeep yourself hydrated.\nMonitor temperature if feverish.";
  let warning = "If symptoms persist for more than 3 days.";

  if (symptoms.toLowerCase().match(/chest|heart|breath|saans|chhati/i)) {
    urgency = "HIGH";
    condition = "Possible heart condition, chest infection, or severe anxiety.";
    tips = "Sit down and try to stay calm.\nLoosen any tight clothing.\nDo not exert yourself.";
    warning = "Severe pain spreading to arms, or heavy sweating.";
  } else if (age > 60 || age < 5 || symptoms.toLowerCase().match(/severe|blood|extreme/i)) {
    urgency = "MEDIUM";
    condition = "Moderate infection or age-related vulnerability requiring care.";
    tips = "Avoid strenuous activities.\nHave light, easily digestible food.\nStay in a cool, well-ventilated room.";
    warning = "Sudden drop in energy or inability to consume liquids.";
  }

  return `**Possible Conditions:**\n${condition}\n\n**Home Care Advice:**\n${tips}\n\n**Urgency:** ${urgency}\nRequires attention based on reported severity and age.\n\n**When to See Doctor:**\n${warning}\n\n*(Note: This is an AI Fallback Demo response because the API key is missing)*`;
}

async function callClaude(prompt, max_tokens = 400) {
  const isKeyInvalid = !API_KEY || API_KEY.startsWith("sk-ant-xxxx") || API_KEY.length < 20;

  if (isKeyInvalid) {
    console.log("⚠️ Using Demo AI mode (No valid Anthropic Key detected).");
    return generateMockAnalysis(prompt);
  }

  try {
    // node-fetch is needed for Node 16. In newer Node versions, global fetch works.
    // Using global fetch where available, otherwise falls back to a mock for safety.
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.warn(`API Error ${response.status}: falling back to Demo Mode.`);
      return generateMockAnalysis(prompt);
    }
    const data = await response.json();
    return data.content?.map(b => b.text || "").join("") || "";
  } catch (err) {
    console.warn("Network error calling Claude, using Demo Mode fallback.", err.message);
    return generateMockAnalysis(prompt);
  }
}

// @route   POST /api/ai/analyze
router.post('/analyze', async (req, res) => {
  const { symptoms, age, lang } = req.body;

  const langNames = {
    english: "English", hindi: "Hindi", marathi: "Marathi"
  };
  const langName = langNames[lang] || "English";

  const prompt = `You are a rural healthcare assistant in India.
Patient symptoms: "${symptoms}"
Patient age: ${age} years

Reply ONLY in ${langName} language. Use this EXACT structure (keep under 120 words):

**Possible Conditions:**
[2-3 likely conditions, simple non-alarming language]

**Home Care Advice:**
[3-4 practical home remedies]

**Urgency:** [ONE word only: LOW or MEDIUM or HIGH]
[One sentence reason]

**When to See Doctor:**
[2-3 warning signs for age ${age}]

No jargon. Simple words only.`;

  try {
    const text = await callClaude(prompt);
    res.json({ result: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { symptoms, age, lang, history, userMessage } = req.body;

  const langNames = {
    english: "English", hindi: "Hindi", marathi: "Marathi"
  };
  const langName = langNames[lang] || "English";

  const prompt = `Rural health assistant. Patient age ${age}, symptoms: "${symptoms}".
Reply in ${langName}. Max 60 words. Simple. No jargon. If serious say: see doctor now.

Conversation:
${history || "None"}

Patient: "${userMessage}"
Reply:`;

  try {
    const text = await callClaude(prompt, 200);
    res.json({ result: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
