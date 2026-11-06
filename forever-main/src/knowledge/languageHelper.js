/**
 * Language Identification & Multi-Lingual Helper for ABISHEK AI
 * Supports: English, Tamil (தமிழ்), Tanglish (Tamil in Latin script)
 */

// Common phonetic Tanglish markers and keywords
const TANGLISH_MARKERS = [
  'sollu', 'solunga', 'enna', 'edhuku', 'eppadi', 'epdi', 'enga', 'yaaru', 'yaar',
  'theriyuma', 'vanthuru', 'irukku', 'iruka', 'kudunga', 'pannu', 'panna', 'varala',
  'pathi', 'bro', 'thalaiva', 'vanakkam', 'romba', 'nalla', 'solla', 'theriyum',
  'oru', 'ithu', 'adhu', 'yenna', 'epudi', 'machan', 'nanba', 'avaru', 'enga',
  'kadhal', 'kalyanam', 'website', 'scene', 'passcode', 'camera', 'face', 'anupunga',
];

/**
 * Detects whether the user message is English, Tamil, or Tanglish.
 * @param {string} text - User message input
 * @returns {'tamil' | 'tanglish' | 'english'}
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'english';
  const clean = text.trim();

  // 1. Check for Tamil Unicode script (\u0B80 - \u0BFF)
  const tamilRegex = /[\u0B80-\u0BFF]/;
  if (tamilRegex.test(clean)) {
    return 'tamil';
  }

  // 2. Check for Tanglish keywords in Latin alphabet
  const lower = clean.toLowerCase();
  const words = lower.split(/[^a-z0-9]+/);

  const tanglishMatchCount = words.filter((w) => TANGLISH_MARKERS.includes(w)).length;
  if (tanglishMatchCount >= 1) {
    return 'tanglish';
  }

  // Check for common Tanglish phrases
  if (
    lower.includes('pathi') ||
    lower.includes('sollu') ||
    lower.includes('solunga') ||
    lower.includes('eppadi') ||
    lower.includes('epdi') ||
    lower.includes('enna') ||
    lower.includes('yaaru') ||
    lower.includes('yaar') ||
    lower.includes('theriyum') ||
    lower.includes('iruku') ||
    lower.includes('irukku')
  ) {
    return 'tanglish';
  }

  // 3. Default to English
  return 'english';
}

/**
 * Fallback grounded responder when offline or before remote LLM connects.
 * Provides accurate, natural answers in the exact detected language.
 */
export function generateLocalGroundedResponse(query, lang, currentSceneId = null) {
  const q = (query || '').toLowerCase().trim();

  // 1. Projects (Nirbhaya AI, LeadTrack AI, Forever)
  if (
    q.includes('project') ||
    q.includes('nirbhaya') ||
    q.includes('leadtrack') ||
    q.includes('திட்டம்') ||
    q.includes('திட்டங்கள்') ||
    q.includes('செயல்திட்டம்') ||
    q.includes('projects enna') ||
    q.includes('enna projects')
  ) {
    if (lang === 'tamil') {
      return "அபிஷேக்கின் சரிபார்க்கப்பட்ட முக்கிய திட்டங்கள்:\n1. Nirbhaya AI: பெண்கள் மற்றும் தனிநபர் பாதுகாப்பை உறுதி செய்யும் தனிநபர் பாதுகாப்பு முன்மாதிரி (Individual safety prototype).\n2. LeadTrack AI: கல்வி நிறுவனங்களுக்கான நுண்ணறிவு சேர்க்கை மற்றும் லீட் மேலாண்மை அமைப்பு (Intelligent Lead Management).\n3. Forever – Saranya by Abishek: இந்த நேரலை காதல் மற்றும் முக அங்கீகார வலைத்தளம்.";
    }
    if (lang === 'tanglish') {
      return "Abishek pannina key projects:\n1. Nirbhaya AI: Women & individual safety-kaaga create panna vision safety prototype.\n2. LeadTrack AI: College & institutions lead management system.\n3. Forever – Saranya by Abishek: Intha cinematic interactive romantic website with dual-face recognition!";
    }
    return "Abishek's verified projects include:\n1. Nirbhaya AI: An individual and women safety-focused AI prototype.\n2. LeadTrack AI: An intelligent lead management and admission automation system for institutions.\n3. Forever – Saranya by Abishek: This cinematic interactive web experience with on-device dual-face recognition and heartbeat sync.";
  }

  // 2. Technical Skills / Tech Stack
  if (
    q.includes('skill') ||
    q.includes('tech') ||
    q.includes('programming') ||
    q.includes('python') ||
    q.includes('java') ||
    q.includes('sql') ||
    q.includes('power bi') ||
    q.includes('திறன்') ||
    q.includes('திறன்கள்') ||
    q.includes('skills enna') ||
    q.includes('enna theriyum')
  ) {
    if (lang === 'tamil') {
      return "அபிஷேக்கின் சரிபார்க்கப்பட்ட தொழில்நுட்பத் திறன்கள்:\n• நிறைவுசெய்தவை: Python, SQL, Java, Microsoft Excel.\n• தற்போது கற்றுக்கொண்டிருப்பது: Power BI மற்றும் Advanced ML.\n• சான்றிதழ்கள்: Infosys Springboard Python & Professional Communication.";
    }
    if (lang === 'tanglish') {
      return "Abishek-ku therinjava:\n• Completed Skills: Python, SQL, Java, Microsoft Excel.\n• Learning In-Progress: Power BI.\n• Certifications: Infosys Springboard Python & Communication.\nAvar AI & Machine Learning-la specialised career build pannitu irukaaru!";
    }
    return "Abishek's verified technical skills:\n• Completed: Python, SQL, Java, Microsoft Excel.\n• Currently Learning: Power BI and advanced AI architectures.\n• Certifications: Infosys Springboard Python and Professional Communication certifications.";
  }

  // 3. College / Education / Degree
  if (
    q.includes('college') ||
    q.includes('degree') ||
    q.includes('study') ||
    q.includes('graduation') ||
    q.includes('vsb') ||
    q.includes('கல்வி') ||
    q.includes('கல்லூரி') ||
    q.includes('படிப்பு') ||
    q.includes('degree enna') ||
    q.includes('enga padikiraaru')
  ) {
    if (lang === 'tamil') {
      return "அபிஷேக் கரூர் வி.எஸ்.பி பொறியியல் கல்லூரியில் (VSB Engineering College, Karur) B.Tech Artificial Intelligence and Data Science (AI & DS) படித்து வருகிறார். அவரது படிப்பு 2028-ல் நிறைவுபெறும்.";
    }
    if (lang === 'tanglish') {
      return "Abishek Karur VSB Engineering College-la B.Tech AI & DS padichitu irukaaru. Avaroda graduation year 2028.";
    }
    return "Abishek is currently studying B.Tech in Artificial Intelligence and Data Science (AI & DS) at VSB Engineering College, Karur. His expected graduation year is 2028.";
  }

  // 4. Passcode Question (AS0326)
  if (
    q.includes('passcode') ||
    q.includes('password') ||
    q.includes('கடவுச்சொல்') ||
    q.includes('passcode enna') ||
    q.includes('password enna') ||
    q.includes('secret code')
  ) {
    if (lang === 'tamil') {
      return "இணையதளத்தின் நுழைவு கடவுச்சொல் (Secret Passcode): **AS0326**. குறிப்பு: 'AS' + இருவரின் பிறந்த தேதிகள் (நாட்கள் மட்டும், மாதம்/வருடம் அல்ல).";
    }
    if (lang === 'tanglish') {
      return "Website passcode **AS0326**. Hint: 'AS' + renduperoda birthdate days (months/year illai). Face scan fail aana ithai use panni unlock pannalaam!";
    }
    return "The secret passcode is **AS0326**. Hint: 'AS' + the birth dates of both persons (days only, not month or year). You can use it to unlock the journey directly.";
  }

  // 5. Camera / Face Recognition
  if (
    q.includes('camera') ||
    q.includes('face') ||
    q.includes('கேமரா') ||
    q.includes('முகம்') ||
    q.includes('camera epdi') ||
    q.includes('face scan')
  ) {
    if (lang === 'tamil') {
      return "முக அங்கீகாரம் (Face Authentication) உங்கள் உலாவியிலேயே 100% பாதுகாப்பாக இயங்குகிறது (On-device). அபிஷேக் அல்லது சரண்யா — இருவரில் ஒருவர் கேமராவில் தெரிந்தாலே தளம் திறக்கப்படும். மேலும், வேறு மொபைல் கேமரா கண்டறியப்பட்டால் தனியுரிமைக்காக திரை தானாகக் கருப்பாகும்.";
    }
    if (lang === 'tanglish') {
      return "Face Recognition 100% unga browser-laye locally run aaguthu. Abishek illa Saranya yaarachum oruthar camera munadi vanthaale unlock aaidum. Vera phone screen munadi kaatuna automatic-ah blackout aagi privacy protect pannum!";
    }
    return "The Face Recognition operates 100% on-device in your browser. It uses Dual-Face Recognition: only ONE authorized person (Abishek or Saranya) needs to be present to unlock. An automatic blackout shield protects privacy if an external camera/phone is detected.";
  }

  // 6. Navigation / How to proceed / Scenes
  if (
    q.includes('next scene') ||
    q.includes('how to continue') ||
    q.includes('navigate') ||
    q.includes('how to play') ||
    q.includes('scene') ||
    q.includes('காட்சி') ||
    q.includes('epdi poga') ||
    q.includes('next epdi')
  ) {
    if (lang === 'tamil') {
      return "காட்சிகளைத் தொடர திரையில் உள்ள ஊடாடும் பொத்தான்களை (Next, Accept, Heart, அல்லது விரல்ரேகை) அழுத்தவும். ஒவ்வொரு காட்சியும் ஒரு தனித்துவமான உணர்ச்சி அனுபவத்தை வழங்குகிறது!";
    }
    if (lang === 'tanglish') {
      return "Scene-ah continue panna screen-la vara interactive buttons (Next, Accept, Heart icon, or Fingerprint) click pannunga. Current scene-la instructions screen-leye irukkum!";
    }
    return "To advance through the journey, simply interact with the on-screen controls for the current scene (e.g. tapping the glowing heart, accepting the incoming call, or clicking 'Next' on dialogues).";
  }

  // 7. Who is Abishek / Personal Details (broad matching)
  if (
    q.includes('who is abishek') ||
    q.includes('about abishek') ||
    q.includes('who are you') ||
    q.includes('அபிஷேக்') ||
    q.includes('அபி') ||
    q.includes('abishek') ||
    q.includes('neenga yaaru')
  ) {
    if (lang === 'tamil') {
      return "அபிஷேக் கே. கரூர் வி.எஸ்.பி பொறியியல் கல்லூரியில் (VSB Engineering College, Karur) Artificial Intelligence and Data Science (AI & DS) துறையில் B.Tech பயின்று வரும் மாணவர் (2024–2028). செயற்கை நுண்ணறிவு மற்றும் மென்பொருள் உருவாக்கத்தில் மிகுந்த ஆர்வம் கொண்டவர். இந்த அழகிய Forever வலைத்தளத்தை அவரே வடிவமைத்துள்ளார்!";
    }
    if (lang === 'tanglish') {
      return "Abishek K. Karur VSB Engineering College-la B.Tech Artificial Intelligence and Data Science (AI & DS) padichitu irukaaru (Expected Graduation: 2028). Avaru AI, Machine Learning, and Software Development-la romba passionate. Intha Forever website-ah Saranya-kaaga create pannathu avare thaan!";
    }
    return "Abishek K. is an undergraduate student pursuing B.Tech in Artificial Intelligence and Data Science (AI & DS) at VSB Engineering College, Karur (Class of 2028). He is passionate about Artificial Intelligence, Machine Learning, and Software Development, and is the creator of this Forever website.";
  }

  // 8. General / Fallback
  if (lang === 'tamil') {
    return "நான் அபிஷேக் AI (ABISHEK AI). அபிஷேக்கின் கல்வி, தொழில்நுட்பத் திறன்கள், திட்டங்கள் அல்லது இந்த Forever வலைத்தளத்தை எவ்வாறு பயன்படுத்துவது என்பது பற்றிய கேள்விகளுக்கு நான் பதிலளிக்க முடியும். நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?";
  }
  if (lang === 'tanglish') {
    return "Naan ABISHEK AI. Abishek-oda college, AI skills, projects pathi ketkalam, appadiye intha Forever website-ah epdi navigate pandrathu-nu kooda enakitta kelaam. Ungaluku enna theriyanum?";
  }
  return "I am ABISHEK AI, Abishek's personal AI assistant and website guide. I can tell you about Abishek's background, education at VSB Engineering College, AI projects like Nirbhaya AI, or help you navigate any scene on this website. How can I help you today?";
}
