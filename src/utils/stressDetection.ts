import { StressAnalysis } from '../types';

const stressKeywords = {
  critical: [
    'suicidal', 'kill myself', 'end it all', 'no point', 'give up',
    'can\'t go on', 'worthless', 'hopeless'
  ],
  high: [
    'overwhelmed', 'anxious', 'panic', 'breakdown', 'can\'t cope',
    'terrified', 'exhausted', 'failing', 'drowning', 'crushed'
  ],
  moderate: [
    'stressed', 'worried', 'nervous', 'pressure', 'difficult',
    'struggling', 'tired', 'concerned', 'uncertain', 'frustrated'
  ],
  low: [
    'okay', 'manageable', 'fine', 'handling', 'coping',
    'getting through', 'trying', 'working on'
  ]
};

const positiveWords = ['happy', 'excited', 'grateful', 'proud', 'accomplished', 'relieved', 'better', 'improving'];
const negativeWords = ['sad', 'angry', 'frustrated', 'disappointed', 'afraid', 'lonely', 'isolated'];

export const analyzeStress = (text: string): StressAnalysis => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  let stressLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const detectedIndicators: string[] = [];
  let stressScore = 0;

  if (stressKeywords.critical.some(keyword => lowerText.includes(keyword))) {
    stressLevel = 'critical';
    stressScore = 0.95;
    detectedIndicators.push('Crisis-level language detected');
  } else if (stressKeywords.high.some(keyword => lowerText.includes(keyword))) {
    stressLevel = 'high';
    stressScore = 0.75;
    detectedIndicators.push('High stress indicators');
  } else if (stressKeywords.moderate.some(keyword => lowerText.includes(keyword))) {
    stressLevel = 'moderate';
    stressScore = 0.50;
    detectedIndicators.push('Moderate stress signals');
  } else {
    stressLevel = 'low';
    stressScore = 0.25;
    detectedIndicators.push('Low stress indicators');
  }

  const hasExclamation = (text.match(/!/g) || []).length > 2;
  const hasQuestions = (text.match(/\?/g) || []).length > 2;
  const hasCapitals = text !== text.toLowerCase() && (text.match(/[A-Z]/g) || []).length > 5;

  if (hasExclamation) {
    detectedIndicators.push('Heightened emotional expression');
    stressScore += 0.05;
  }
  if (hasQuestions) {
    detectedIndicators.push('Seeking answers or clarity');
    stressScore += 0.03;
  }
  if (hasCapitals) {
    detectedIndicators.push('Emphasis through capitalization');
    stressScore += 0.05;
  }

  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  const sentimentScore = ((positiveCount - negativeCount) / Math.max(words.length, 10)) * 2;

  const recommendedResources: string[] = [];
  if (stressLevel === 'critical') {
    recommendedResources.push('professional_support', 'crisis_hotlines');
  } else if (stressLevel === 'high') {
    recommendedResources.push('coping_strategies', 'professional_support', 'mindfulness');
  } else if (stressLevel === 'moderate') {
    recommendedResources.push('coping_strategies', 'mindfulness', 'academic_stress');
  } else {
    recommendedResources.push('mindfulness', 'self_care');
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    post_id: '',
    stress_level: stressLevel,
    confidence_score: Math.min(stressScore, 1),
    detected_indicators: detectedIndicators,
    sentiment_score: Math.max(-1, Math.min(1, sentimentScore)),
    recommended_resources: recommendedResources,
    created_at: new Date().toISOString()
  };
};
