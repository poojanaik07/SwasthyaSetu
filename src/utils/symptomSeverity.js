// AI Symptom Severity Engine - Keyword-based classifier
// Returns: { level: 'mild'|'moderate'|'severe', color: string, confidence: number, keywords: string[] }

const SEVERE_KEYWORDS = [
  'chest pain', 'chest tightness', 'difficulty breathing', 'can\'t breathe',
  'shortness of breath', 'unconscious', 'fainted', 'paralysis', 'stroke',
  'heart attack', 'severe bleeding', 'blood', 'bleed', 'allergic reaction',
  'anaphylaxis', 'poisoning', 'seizure', 'convulsion', 'coma',
  'high fever', 'very high fever', '104', '105', 'emergency', 'severe pain',
  'crushing pain', 'intense pain', 'extreme', 'critical', 'बहुत तेज़', 'सीने में दर्द'
];

const MODERATE_KEYWORDS = [
  'fever', 'persistent cough', 'vomiting', 'nausea', 'diarrhea',
  'headache', 'body ache', 'fatigue', 'tiredness', 'weakness', 'dizziness',
  'swelling', 'rash', 'infection', 'pain', 'ache', 'moderate',
  'sore throat', 'ear pain', 'back pain', 'stomach pain', 'abdominal',
  'dehydration', 'anxiety', 'breathlessness', 'बुखार', 'दर्द', 'उल्टी'
];

const MILD_KEYWORDS = [
  'mild', 'slight', 'little', 'minor', 'cold', 'runny nose', 'sneezing',
  'itching', 'scratch', 'dry skin', 'light', 'small cut', 'bruise',
  'tired', 'uncomfortable', 'stuffy nose', 'cough', 'थोड़ा', 'हल्का'
];

export function analyzeSeverity(text) {
  if (!text || text.trim().length === 0) return null;

  const lower = text.toLowerCase();
  const detectedKeywords = [];
  let severeScore = 0;
  let moderateScore = 0;
  let mildScore = 0;

  SEVERE_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      severeScore += 3;
      detectedKeywords.push({ word: kw, level: 'severe' });
    }
  });

  MODERATE_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      moderateScore += 2;
      detectedKeywords.push({ word: kw, level: 'moderate' });
    }
  });

  MILD_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) {
      mildScore += 1;
      detectedKeywords.push({ word: kw, level: 'mild' });
    }
  });

  const total = severeScore + moderateScore + mildScore;
  if (total === 0) return null;

  let level, color, emoji;
  if (severeScore > 0) {
    level = 'severe';
    color = '#ef4444';
    emoji = '🔴';
  } else if (moderateScore >= mildScore) {
    level = 'moderate';
    color = '#eab308';
    emoji = '🟡';
  } else {
    level = 'mild';
    color = '#22c55e';
    emoji = '🟢';
  }

  const confidence = Math.min(100, Math.round((total / (total + 2)) * 100));

  return {
    level,
    color,
    emoji,
    confidence,
    keywords: detectedKeywords.slice(0, 5),
    message: level === 'severe'
      ? '⚠️ Possibly serious condition. Immediate consultation recommended.'
      : level === 'moderate'
      ? 'Moderate symptoms detected. Doctor consultation advised.'
      : 'Mild symptoms detected. Monitor and rest.'
  };
}
