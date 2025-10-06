import { Resource } from '../types';

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Deep Breathing Exercise',
    description: 'A simple 5-minute breathing technique to reduce immediate stress and anxiety',
    category: 'mindfulness',
    type: 'exercise',
    content: 'Practice 4-7-8 breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times. This activates your parasympathetic nervous system and promotes calm.',
    tags: ['breathing', 'quick', 'anxiety']
  },
  {
    id: '2',
    title: 'Managing Academic Stress',
    description: 'Evidence-based strategies for handling study pressure and exam anxiety',
    category: 'academic_stress',
    type: 'article',
    content: 'Break tasks into smaller chunks, use the Pomodoro technique (25 min focus, 5 min break), maintain a consistent sleep schedule, and practice self-compassion. Remember: Your worth is not defined by grades.',
    tags: ['studying', 'exams', 'time-management']
  },
  {
    id: '3',
    title: 'Progressive Muscle Relaxation',
    description: 'Body-based technique to release physical tension',
    category: 'coping_strategies',
    type: 'exercise',
    content: 'Starting with your toes, tense each muscle group for 5 seconds, then release. Move up through your body: feet, calves, thighs, abdomen, chest, arms, hands, neck, face. Notice the difference between tension and relaxation.',
    tags: ['physical', 'tension', 'relaxation']
  },
  {
    id: '4',
    title: 'When to Seek Professional Help',
    description: 'Understanding signs that you might benefit from counseling',
    category: 'professional_support',
    type: 'article',
    content: 'Consider reaching out if: feelings persist for 2+ weeks, daily activities are impacted, you have thoughts of self-harm, substance use increases, or sleep/appetite significantly changes. Most campuses offer free counseling services.',
    tags: ['therapy', 'counseling', 'crisis']
  },
  {
    id: '5',
    title: 'Mindful Walking Meditation',
    description: 'Moving meditation to ground yourself in the present',
    category: 'mindfulness',
    type: 'exercise',
    content: 'Walk slowly, paying attention to each step. Notice the sensation of your feet touching the ground, your body moving through space, sounds around you. When your mind wanders, gently return focus to the physical sensations of walking.',
    tags: ['meditation', 'grounding', 'movement']
  },
  {
    id: '6',
    title: 'Building a Support Network',
    description: 'Creating meaningful connections for emotional resilience',
    category: 'social_support',
    type: 'article',
    content: 'Identify 3 people you can reach out to. Join study groups or clubs. Use campus mental health resources. Remember: asking for help is a sign of strength, not weakness. Connection is protective against stress.',
    tags: ['relationships', 'community', 'support']
  },
  {
    id: '7',
    title: 'Journaling for Mental Clarity',
    description: 'Using writing to process thoughts and emotions',
    category: 'coping_strategies',
    type: 'exercise',
    content: 'Spend 10 minutes writing freely without judgment. Try prompts: "I feel...", "What is within my control?", "What am I grateful for today?". Research shows expressive writing reduces stress and improves well-being.',
    tags: ['writing', 'reflection', 'emotions']
  },
  {
    id: '8',
    title: 'Sleep Hygiene for Students',
    description: 'Optimizing rest for better mental health and academic performance',
    category: 'self_care',
    type: 'article',
    content: 'Maintain consistent sleep/wake times, avoid screens 1 hour before bed, keep your room cool and dark, limit caffeine after 2pm. Quality sleep is crucial for memory consolidation, emotional regulation, and stress resilience.',
    tags: ['sleep', 'routine', 'health']
  },
  {
    id: '9',
    title: 'Crisis Hotlines and Resources',
    description: 'Immediate support available 24/7',
    category: 'crisis_hotlines',
    type: 'hotline',
    content: 'National Crisis Hotline: 988 (call or text)\nCrisis Text Line: Text HOME to 741741\nInternational Crisis Lines: findahelpline.com\n\nYou are not alone. Help is available right now.',
    tags: ['crisis', 'emergency', 'immediate-help']
  },
  {
    id: '10',
    title: 'Grounding Techniques for Anxiety',
    description: '5-4-3-2-1 technique to anchor yourself during panic',
    category: 'coping_strategies',
    type: 'exercise',
    content: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This brings your focus to the present moment and interrupts the anxiety spiral.',
    tags: ['anxiety', 'panic', 'grounding', 'quick']
  }
];
