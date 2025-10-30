interface ResponseContext {
  userMessage: string;
  conversationHistory: { role: string; content: string }[];
  detectedStressLevel: string;
  detectedKeywords: string[];
}

export const generateAIResponse = (context: ResponseContext): string => {
  const { userMessage, conversationHistory, detectedStressLevel } = context;
  const lowerMessage = userMessage.toLowerCase();

  if (detectedStressLevel === 'critical') {
    return generateCrisisResponse(lowerMessage);
  }

  if (isGreeting(lowerMessage) && conversationHistory.length <= 2) {
    return generateGreetingResponse(lowerMessage);
  }

  if (isAboutAnxiety(lowerMessage)) {
    return generateAnxietyResponse(lowerMessage, conversationHistory);
  }

  if (isAboutDepression(lowerMessage)) {
    return generateDepressionResponse(lowerMessage, conversationHistory);
  }

  if (isAboutStress(lowerMessage)) {
    return generateStressResponse(lowerMessage, conversationHistory);
  }

  if (isAboutSleep(lowerMessage)) {
    return generateSleepResponse(lowerMessage);
  }

  if (isAboutLoneliness(lowerMessage)) {
    return generateLonelinessResponse(lowerMessage);
  }

  if (isAboutAcademics(lowerMessage)) {
    return generateAcademicResponse(lowerMessage);
  }

  if (isAboutRelationships(lowerMessage)) {
    return generateRelationshipResponse(lowerMessage);
  }

  if (isGratitudeExpression(lowerMessage)) {
    return generateGratitudeResponse();
  }

  if (isAskingForHelp(lowerMessage)) {
    return generateHelpResponse();
  }

  return generateReflectiveResponse(conversationHistory);
};

const isGreeting = (msg: string): boolean => {
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(g => msg.startsWith(g));
};

const isAboutAnxiety = (msg: string): boolean => {
  return /anxious|anxiety|panic|worried|nervous|fear|scared/.test(msg);
};

const isAboutDepression = (msg: string): boolean => {
  return /depress|sad|hopeless|empty|numb|worthless|unmotivated/.test(msg);
};

const isAboutStress = (msg: string): boolean => {
  return /stress|overwhelm|pressure|burden|too much|can't handle/.test(msg);
};

const isAboutSleep = (msg: string): boolean => {
  return /sleep|insomnia|tired|exhausted|can't sleep|nightmares/.test(msg);
};

const isAboutLoneliness = (msg: string): boolean => {
  return /lonely|alone|isolated|no friends|nobody/.test(msg);
};

const isAboutAcademics = (msg: string): boolean => {
  return /exam|test|grade|study|assignment|homework|class|professor|deadline/.test(msg);
};

const isAboutRelationships = (msg: string): boolean => {
  return /relationship|friend|family|breakup|argument|fight|conflict/.test(msg);
};

const isGratitudeExpression = (msg: string): boolean => {
  return /thank|helpful|appreciate|grateful/.test(msg);
};

const isAskingForHelp = (msg: string): boolean => {
  return /help me|what should|what can|advice|suggest/.test(msg);
};

const generateCrisisResponse = (msg: string): string => {
  return `I'm very concerned about what you're sharing. Your life has value, and help is available right now. Please reach out immediately:

📞 **Call or text 988** - National Crisis Hotline (24/7, free, confidential)
💬 **Text HOME to 741741** - Crisis Text Line
🌐 **findahelpline.com** - International support

You don't have to face this alone. These trained counselors are ready to listen and help. Would you be willing to reach out to one of these services? I'm here with you.`;
};

const generateGreetingResponse = (msg: string): string => {
  const responses = [
    "Hello! I'm glad you're here. This is a safe, judgment-free space. How are you feeling today?",
    "Hi there! Thank you for reaching out. I'm here to listen and support you. What's on your mind?",
    "Hey! It's good to see you. Remember, whatever you're feeling is valid. How can I support you today?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateAnxietyResponse = (msg: string, history: { role: string; content: string }[]): string => {
  const hasDiscussedBefore = history.some(h => h.content.includes('anxiety') || h.content.includes('4-7-8'));

  if (hasDiscussedBefore) {
    return `I hear you're still experiencing anxiety. Let's try something different:

**Progressive Muscle Relaxation:**
1. Tense your shoulders for 5 seconds, then release
2. Clench your fists for 5 seconds, then release
3. Notice the difference between tension and relaxation

**Reframe the thought:**
Instead of "What if something bad happens?" try "I can handle whatever comes my way."

What triggered this anxiety today? Understanding triggers helps us manage them better.`;
  }

  return `I understand you're feeling anxious. Anxiety can feel overwhelming, but there are effective ways to manage it:

**Immediate Relief - 4-7-8 Breathing:**
• Breathe in slowly through your nose for 4 counts
• Hold for 7 counts
• Exhale through your mouth for 8 counts
• Repeat 4 times

**Grounding - 5-4-3-2-1 Technique:**
Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.

Remember: Anxiety is uncomfortable, but it's not dangerous. It will pass. What's triggering these feelings right now?`;
};

const generateDepressionResponse = (msg: string, history: { role: string; content: string }[]): string => {
  return `Thank you for trusting me with this. Depression can make everything feel heavier, but you don't have to carry this alone.

**Small Steps Matter:**
🌅 Get sunlight for 10 minutes today - even opening curtains helps
🚶 Move your body, even a 5-minute walk can shift your mood
🤝 Reach out to one person - just saying "hi" counts
📝 Write down one small thing you're grateful for

**Important reminders:**
• Depression lies - it tells you things won't get better, but they can and do
• You're not weak for feeling this way
• Professional support can make a real difference

Have you considered talking to a counselor? Many students find therapy incredibly helpful. Would you like resources for finding support?`;
};

const generateStressResponse = (msg: string, history: { role: string; content: string }[]): string => {
  if (msg.includes('exam') || msg.includes('deadline')) {
    return generateAcademicResponse(msg);
  }

  return `Feeling stressed is your mind and body telling you something needs attention. Let's work through this together:

**Immediate stress reduction:**
🧠 Brain dump - write everything that's stressing you out for 5 minutes
📊 Prioritize - what's actually urgent vs. what feels urgent?
⏰ Choose ONE thing to focus on right now
🛑 Give yourself permission to let some things wait

**What's the biggest stressor right now?** Sometimes just naming it reduces its power.

Remember: You can only do one thing at a time. Multitasking increases stress without improving results. What feels most important to address first?`;
};

const generateSleepResponse = (msg: string): string => {
  return `Sleep problems and mental health are deeply connected. Let's work on improving your sleep:

**Sleep Hygiene Essentials:**
🌙 Same bedtime and wake time (even weekends) - your body loves consistency
📱 No screens 1 hour before bed (blue light disrupts melatonin)
☕ Cut caffeine after 2pm
🏃 Exercise, but not within 3 hours of bedtime
🌡️ Keep room cool (60-67°F is ideal)
📖 Create a wind-down routine: reading, stretching, meditation

**If your mind races at night:**
• Keep a notepad by your bed - write down worries to address tomorrow
• Try the "cognitive shuffle" - think of random objects (apple, chair, cloud...)
• Practice 4-7-8 breathing

Sleep usually improves with consistent habits over 1-2 weeks. What's your biggest sleep challenge - falling asleep or staying asleep?`;
};

const generateLonelinessResponse = (msg: string): string => {
  return `Loneliness is painful, and I'm glad you're opening up about it. You're not alone in feeling lonely - it's incredibly common among students.

**Small steps toward connection:**
🤝 Join one campus club or activity aligned with your interests
💬 Start small - say hi to someone in class or at the gym
📚 Study groups create natural opportunities for connection
🎯 Volunteer - helping others combats loneliness
💻 Online communities around your hobbies count too

**Remember:**
• Quality matters more than quantity - one good friend beats 100 acquaintances
• Connection takes time - be patient with yourself
• Reach out even when it's hard - courage is doing it scared

What's one small step toward connection that feels achievable this week? Even texting someone "thinking of you" counts.`;
};

const generateAcademicResponse = (msg: string): string => {
  return `Academic stress is incredibly common. Let's create a realistic approach:

**Effective Study Strategies:**
📚 Pomodoro: 25 minutes focused work, 5 minute break
📅 Create a realistic schedule - underestimate what you can do
✅ Start with the hardest task when your brain is fresh
🧠 Active recall beats re-reading - test yourself frequently
👥 Study groups for accountability and different perspectives

**Managing Exam Anxiety:**
• Focus on understanding, not memorizing
• Practice in exam-like conditions
• Remember: one exam doesn't define you or your future
• Sleep before the exam matters more than cramming

**If you're truly overwhelmed:**
Talk to your professor during office hours - they want you to succeed. Many have been where you are.

What specific aspect of academics is most stressful right now? Let's problem-solve together.`;
};

const generateRelationshipResponse = (msg: string): string => {
  return `Relationship challenges affect our mental health deeply. Thank you for sharing.

**Healthy Communication Basics:**
💬 Use "I feel" statements instead of "You always/never"
👂 Listen to understand, not to respond
⏸️ Take breaks if things get heated - return when calm
🎯 Focus on the issue, not attacking the person

**Remember:**
• Healthy relationships involve respect, trust, and communication
• It's okay to set boundaries - they protect your wellbeing
• You can't control others, only your responses
• Sometimes relationships end, and that's okay too

**If you're in an unhealthy or abusive relationship:**
That's not your fault. Please reach out to campus counseling or call the National Domestic Violence Hotline: 1-800-799-7233

What feels most challenging about this relationship right now?`;
};

const generateGratitudeResponse = (): string => {
  return `You're very welcome! I'm genuinely glad I could help.

Taking care of your mental health is a sign of strength, not weakness. Keep checking in with yourself, practice self-compassion, and remember that it's okay to not be okay sometimes.

Is there anything else on your mind today? I'm here whenever you need to talk.`;
};

const generateHelpResponse = (): string => {
  return `I'm here to help in several ways:

💬 **Active Listening** - Share what's on your mind without judgment
🧠 **Coping Strategies** - Evidence-based techniques for anxiety, stress, sleep, etc.
🎯 **Problem-Solving** - Work through challenges step by step
📚 **Resource Connection** - Point you toward professional help if needed

**I'm best at helping with:**
• Stress and anxiety management
• Academic pressure and time management
• Loneliness and connection
• Sleep issues
• General mental wellness

**I cannot replace:**
• Professional therapy or diagnosis
• Crisis intervention (though I can connect you to crisis resources)
• Medication management

What would be most helpful for you right now?`;
};

const generateReflectiveResponse = (history: { role: string; content: string }[]): string => {
  const lastUserMessages = history
    .filter(h => h.role === 'user')
    .slice(-3)
    .map(h => h.content.toLowerCase())
    .join(' ');

  const isOpeningUp = lastUserMessages.length > 100;

  if (isOpeningUp) {
    return `Thank you for sharing that with me. I'm listening.

It sounds like you're dealing with quite a bit. Can you tell me more about how this is affecting you day-to-day? Understanding the full picture helps me support you better.

Also, have you been able to take care of basics like eating, sleeping, and moving your body? These fundamentals really impact how we cope with everything else.`;
  }

  return `I want to make sure I understand and can offer the most helpful support. Could you tell me a bit more?

**These details often help:**
• How long have you been feeling this way?
• What situations or thoughts trigger these feelings?
• What have you tried that's helped, even a little?
• How is this affecting your daily life - sleep, eating, relationships, academics?

Remember, this is a safe space. There's no wrong answer, and I'm here to listen without judgment.`;
};
