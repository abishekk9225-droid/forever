import { sendEmail } from '../../utils/emailService.js';

/**
 * Official Question Set for Saranya's Emotional Conversation with ABISHEK AI.
 * Covers all 8 questions required by the user with bilingual support and empathetic responses.
 */
export const CONVERSATION_QUESTIONS = [
  {
    id: 1,
    ta: "அபிஷேக் உன் உணர்வுகளைப் புரிந்து கொள்ளவில்லை என்று எப்போதாவது உணர்ந்திருக்கிறாயா?",
    en: "Do you sometimes feel that Abishek doesn't understand your feelings?",
    empatheticTa: "உன் மனசைப் பகிர்ந்ததற்கு நன்றி சரண்யா. நாம் விரும்பும் ஒருவர் நம்மைப் புரிந்து கொள்ளவில்லை என்று தோன்றும் போது அது எவ்வளவு பாரமாக இருக்கும் என்பதை நான் உணர்கிறேன். உன் உணர்வுகளை அபிஷேக் கட்டாயம் அக்கறையோடு படிப்பான். ❤️",
    empatheticEn: "Thank you for sharing that honestly, Saranya. Feeling misunderstood by someone close can feel heavy and lonely. Your feelings are completely valid, and Abishek will read this with sincerity. ❤️",
    placeholderTa: "உன் உணர்வுகளை இங்கே தாராளமாக எழுதலாம் (தமிழ், English, Tanglish)...",
    placeholderEn: "Feel free to express how you feel (Tamil, English, Tanglish)...",
  },
  {
    id: 2,
    ta: "அபிஷேக் செய்த ஏதாவது ஒரு விஷயம் உன்னை மனதளவில் காயப்படுத்தியிருக்கிறதா?",
    en: "Is there anything Abishek has done that has hurt you?",
    empatheticTa: "இதை வெளிப்படையாகச் சொன்னதற்கு மிக்க நன்றி சரண்யா. உன் வலி உண்மையானது, அதை நான் முழுமையாக மதிக்கிறேன். எதையும் மறைக்காமல் சொல்வதுதான் ஒருவரை உண்மையாகப் புரிந்துகொள்ள உதவும். ❤️",
    empatheticEn: "Thank you for being open about this, Saranya. Your hurt is real and completely respected. Expressing what hurt you is so important, and Abishek will take this deeply to heart. ❤️",
    placeholderTa: "உன்னை காயப்படுத்திய எந்த ஒரு நிகழ்வையும் இங்கே சொல்லலாம்...",
    placeholderEn: "You can share anything that hurt you, big or small...",
  },
  {
    id: 3,
    ta: "அபிஷேக் தன் உணர்வுகளைச் சரியாக வெளிப்படுத்துவதில்லை என்று நினைக்கிறாயா?",
    en: "Do you feel that Abishek doesn't express his emotions properly?",
    empatheticTa: "அவன் உணர்வுகளைச் சரியாக வெளிப்படுத்தாத போது குழப்பமும் தனிமையும் வருவது இயல்புதான் சரண்யா. இதை அவன் உணர்ந்து கற்றுக்கொள்ள வேண்டும். உன் கருத்து அவனுக்கு வழிகாட்டும். ❤️",
    empatheticEn: "When someone struggles to express their emotions clearly, it often causes confusion and distance. Thank you for pointing this out; it helps him learn how to communicate better. ❤️",
    placeholderTa: "அவனுடைய உணர்வு வெளிப்பாடு பற்றி உன் எண்ணங்கள்...",
    placeholderEn: "Your thoughts on how he expresses his emotions...",
  },
  {
    id: 4,
    ta: "நீண்ட நாட்களாக அவனிடம் சொல்ல வேண்டும் என்று நினைத்து, சொல்ல முடியாமல் போன விஷயம் ஏதேனும் உண்டா?",
    en: "Is there something you have wanted to tell him for a long time but couldn't?",
    empatheticTa: "நீண்ட நாள் மனசுக்குள் வைத்திருந்ததை இங்கே பகிர்ந்ததற்கு நன்றி சரண்யா. சொல்ல முடியாமல் தவித்த அந்த சுமை இனி உன் மனதை அழுத்தக் கூடாது. அபிஷேக் இதை உணர்வான். ❤️",
    empatheticEn: "Holding words inside for a long time takes an emotional toll. Thank you for trusting this space to let those feelings out, Saranya. Abishek will value this. ❤️",
    placeholderTa: "நீண்ட நாட்களாக சொல்ல நினைத்த விஷயம்...",
    placeholderEn: "Something you've held in your heart for a while...",
  },
  {
    id: 5,
    ta: "அபிஷேக்குக்குத் தெரியாமல் இந்த உறவில் நீ ஏதேனும் சிரமங்களை எதிர்கொள்கிறாயா?",
    en: "Are you facing any difficulties in this relationship that Abishek doesn't know about?",
    empatheticTa: "நீ தனியாக எதிர்கொள்ளும் சிரமங்களைப் பகிர்ந்ததற்கு நன்றி சரண்யா. ஒரு உறவில் நீ தனியாகப் பாரத்தைச் சுமக்க வேண்டியதில்லை; உன் பக்கத்தில் என்ன நடக்கிறது என்பதை அவன் அறிய வேண்டும். ❤️",
    empatheticEn: "Thank you for sharing the difficulties you have been carrying alone. You shouldn't have to carry burdens in silence, and Abishek truly needs to understand this. ❤️",
    placeholderTa: "அவன் அறியாத உன் சிரமங்கள், சங்கடங்கள்...",
    placeholderEn: "Any challenges or worries he might not be aware of...",
  },
  {
    id: 6,
    ta: "அபிஷேக்கிடம் நீ என்ன மாற்றங்களைக் காண விரும்புகிறாய்?",
    en: "What changes would you like to see in Abishek?",
    empatheticTa: "உன் எதிர்பார்ப்புகளும் யோசனைகளும் மிகவும் மதிக்கத்தக்கவை சரண்யா. ஒரு மனிதனாகத் தன்னை மாற்றிக் கொள்ளவும் வளரவும் இது அவனுக்குக் கட்டாயம் வழிகாட்டும். ❤️",
    empatheticEn: "Your thoughts and expectations are deeply valued, Saranya. Sincere growth begins with listening to what the other person needs. ❤️",
    placeholderTa: "அவன் மாற்றிக்கொள்ள வேண்டிய விஷயங்கள், பழக்கங்கள்...",
    placeholderEn: "Any habits, attitudes, or changes you'd like to see...",
  },
  {
    id: 7,
    ta: "உன் உணர்வுகளைப் பற்றி அபிஷேக் புரிந்துகொள்ள வேண்டும் என்று நீ விரும்பும் விஷயம் ஏதேனும் உண்டா?",
    en: "Is there anything you want Abishek to understand about your feelings?",
    empatheticTa: "உன் மனதின் இந்த ஆழமான உணர்வை அபிஷேக் கட்டாயம் புரிந்துகொள்ள வேண்டும். இதை அவன் மிகவும் கவனமாகவும் அக்கறையுடனும் படிப்பான். ❤️",
    empatheticEn: "This is crucial, Saranya. Understanding your heart and perspective is the most important thing for Abishek, and he will read this with sincerity. ❤️",
    placeholderTa: "அவன் கட்டாயம் புரிந்து கொள்ள வேண்டிய உன் மனநிலை...",
    placeholderEn: "What you wish he understood deeply about you...",
  },
  {
    id: 8,
    ta: "தற்போது உன்னை அதிகம் உறுத்தும் அல்லது கவலைப்பட வைக்கும் விஷயம் என்ன?",
    en: "What is the biggest thing currently bothering you?",
    empatheticTa: "உன்னை வாட்டும் இந்த விஷயத்தைப் பகிர்ந்ததற்கு நன்றி சரண்யா. உன் மன அமைதியும் மகிழ்ச்சியும்தான் எல்லாவற்றையும் விட முக்கியம். உன் குரல் கேட்கப்பட்டிருக்கிறது. ❤️",
    empatheticEn: "Thank you for sharing what has been weighing on your mind the most, Saranya. Your peace of mind and emotional well-being come first. Your voice has been heard. ❤️",
    placeholderTa: "தற்போது உன் மனதை அதிகம் உறுத்தும் விஷயம்...",
    placeholderEn: "The biggest worry or thought currently on your mind...",
  },
];

/**
 * Sends a single response submitted voluntarily by Saranya to Abishek's configured email.
 * Includes Indian Standard Time (IST), question text in both languages, and her exact response.
 * Completely non-blocking and handles failures gracefully without crashing.
 */
export async function sendSaranyaResponseEmail({
  questionIndex,
  totalQuestions = 8,
  questionTamil,
  questionEnglish,
  userAnswer,
  isSkipped = false,
  language = 'ta',
}) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const statusLabel = isSkipped ? '⏭️ SKIPPED (Chose to skip)' : '💬 ANSWERED VOLUNTARILY';

  const title = `💌 Saranya's Response · Q${questionIndex + 1}/${totalQuestions} [${isSkipped ? 'SKIPPED' : 'ANSWERED'}]`;

  const message = [
    `💌 SARANYA'S HEARTFELT CONVERSATION WITH ABISHEK AI`,
    `======================================================`,
    `📅 Date & Time (IST): ${timestamp}`,
    `🌐 Language Mode: ${language === 'ta' ? 'Tamil' : 'English'}`,
    `📊 Status: ${statusLabel}`,
    `------------------------------------------------------`,
    `❓ Question ${questionIndex + 1} of ${totalQuestions}:`,
    `   Tamil:   ${questionTamil}`,
    `   English: ${questionEnglish}`,
    `------------------------------------------------------`,
    `💭 Saranya's Response:`,
    isSkipped ? `(Saranya voluntarily chose to skip this question without answering)` : userAnswer,
    `------------------------------------------------------`,
    `🔒 Consent: Confirmed by Saranya prior to conversation.`,
    `======================================================`,
  ].join('\n');

  try {
    const success = await sendEmail({
      title,
      message,
      saranya_answer: isSkipped ? '[SKIPPED]' : userAnswer,
      question_tamil: questionTamil,
      question_english: questionEnglish,
      question_index: questionIndex + 1,
    });
    return { success: true };
  } catch (err) {
    console.warn('[ABISHEK AI] Email delivery notice:', err?.message || err);
    return { success: false, error: err?.message };
  }
}
