/**
 * ABISHEK K. - OFFICIAL VERIFIED PERSONAL KNOWLEDGE BASE
 * 
 * Strict Grounding Rules:
 * - Only verified factual information is recorded here.
 * - Completed skills, ongoing learning, and future goals are explicitly distinguished.
 * - No invented awards, unverified experience, or private personal data.
 * - Explicit approved personality and romantic responses are provided verbatim.
 */

export const ABISHEK_PROFILE = {
  fullName: "Abishek K.",
  displayName: "Abishek",
  college: "VSB Engineering College, Karur",
  degree: "B.Tech in Artificial Intelligence and Data Science (AI & DS)",
  expectedGraduation: 2028,
  
  professionalInterests: [
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Deep Learning (DL)",
    "Generative AI (GenAI)",
    "Software & Full-Stack Development",
  ],

  // Completed & verified technical skills
  completedSkills: [
    "Python",
    "SQL",
    "Java",
    "Microsoft Excel",
  ],

  // Currently learning / in progress
  ongoingLearning: [
    "Power BI",
    "Advanced Machine Learning architectures",
    "Cloud AI deployment",
  ],

  // Verified academic & technical certifications
  certifications: [
    {
      title: "Infosys Springboard Python Certification",
      issuer: "Infosys Springboard",
      category: "Programming & Data Structures",
      status: "Completed",
    },
    {
      title: "Infosys Springboard Professional Communication Certification",
      issuer: "Infosys Springboard",
      category: "Professional & Workplace Communication",
      status: "Completed",
    },
  ],

  // Known verified projects
  projects: [
    {
      name: "Nirbhaya AI",
      category: "Safety & Computer Vision / Prototype",
      description:
        "An individual safety-focused AI prototype designed to enhance personal security for individuals and women through proactive alerting and vision intelligence.",
      status: "Prototype / In Development",
    },
    {
      name: "LeadTrack AI",
      category: "Enterprise AI & Management",
      description:
        "An intelligent Lead Management system engineered for educational institutions to automate applicant tracking, follow-ups, and admissions lifecycle.",
      status: "Completed Prototype",
    },
    {
      name: "Forever – Saranya by Abishek",
      category: "Interactive Web Experience & Computer Vision",
      description:
        "A cinematic, interactive web experience built with React, Vite, Tailwind CSS, real-time computer vision for dual-face authentication, heartbeat synchronization, and dynamic storytelling.",
      status: "Live Production Project",
    },
  ],

  // Personality, values & character
  personality: {
    traits: [
      "Curious and eager to learn new things constantly",
      "Genuinely caring and thoughtful towards loved ones",
      "Goal-oriented with big dreams in technology and life",
      "Helpful, humble, and patient nature",
    ],
    summary:
      "Abishek is a curious, thoughtful, and ambitious person who dreams of building impactful software and making the people he cares about feel valued and special.",
  },

  // Career ambitions and future vision
  careerGoals: {
    primary: "To build an impactful career in Artificial Intelligence and the global technology industry.",
    focusAreas: "Developing production-grade AI systems, intelligent automation, and human-centric software.",
    status: "Aspiring AI Engineer / Undergraduate Student",
  },

  // Explicit approved personal messages for Saranya
  approvedMessages: {
    isGoodBoy: {
      en: "Yes! ❤️ Abishek is a good boy. He has a curious mind, dreams of building something meaningful, and is always interested in learning and improving himself. He wants to make the people he cares about feel special.",
      ta: "ஆமாம்! ❤️ அபிஷேக் ஒரு நல்ல பையன். புதிதாகக் கற்றுக்கொள்ள வேண்டும் என்ற ஆர்வமும், வாழ்க்கையில் ஏதாவது சாதிக்க வேண்டும் என்ற கனவும் அவனுக்கு இருக்கிறது. தனக்குப் பிடித்தவர்களைச் சிறப்பாக உணர வைக்க வேண்டும் என்று நினைப்பவன்.",
      tanglish: "Aama! ❤️ Abishek romba nalla paiyan. Pudhusa kathukanum-nu aasaiyum, life-la edhavadhu achieve pannanum-nu periya dream-um avanukku irukku. Thanaku pidichavangala eppavum special-ah vechikkanum-nu ninaipaan.",
    },
    doesHeLoveMe: {
      en: "Abishek wants you to know that his feelings for you are genuine. ❤️ He has created this entire journey as a special expression of his love.",
      ta: "அபிஷேக் உன்னை உண்மையாக நேசிக்கிறான். ❤️ இந்தப் பயணம் முழுவதையும் உனக்காக ஒரு சிறப்பான காதல் வெளிப்பாடாக உருவாக்கியிருக்கிறான். ஒவ்வொரு காட்சியிலும் அவனுடைய அன்பை உனக்கு உணர்த்த வேண்டும் என்பதுதான் அவனுடைய ஆசை.",
      tanglish: "Aama! ❤️ Abishek un mela unmaiyana anbu vechirukkan. Indha website-ah kooda unakkaga oru special love expression-ah create pannirukkan.",
    },
    dreams: {
      en: "Abishek dreams of excelling in Artificial Intelligence, building meaningful safety and enterprise AI systems like Nirbhaya AI, and creating a purposeful, loving life with continuous growth.",
      ta: "செயற்கை நுண்ணறிவு (AI) துறையில் ஒரு சிறந்த எதிர்காலத்தை உருவாக்க வேண்டும், பயனுள்ள தொழில்நுட்பங்களை உருவாக்க வேண்டும், தனக்குப் பிடித்தவர்களுடன் மகிழ்ச்சியான வாழ்க்கையை வாழ வேண்டும் என்பதே அவனுடைய பெருங்கனவு!",
      tanglish: "Artificial Intelligence-la perusa achieve pannanum, Nirbhaya AI maadhiri meaningful projects build pannanum, and life-la pudichavangala eppavum sandhoshama vechirukkanum-nu avan dream panraan!",
    },
  },

  // Boundaries & confidential information
  privacyPolicy: {
    confidentialNotice:
      "Private personal information such as phone numbers, personal residence addresses, and unverified credentials are protected and will never be shared.",
  },
};

/**
 * Returns a grounded summary text of Abishek's profile for LLM system prompting.
 */
export function getGroundedProfilePrompt() {
  return `
OFFICIAL VERIFIED PROFILE OF ABISHEK K.:
- Name: ${ABISHEK_PROFILE.fullName}
- College: ${ABISHEK_PROFILE.college}
- Degree: ${ABISHEK_PROFILE.degree}
- Expected Graduation Year: ${ABISHEK_PROFILE.expectedGraduation}
- Professional Interests: ${ABISHEK_PROFILE.professionalInterests.join(', ')}
- Completed Technical Skills: ${ABISHEK_PROFILE.completedSkills.join(', ')}
- Ongoing Learning: ${ABISHEK_PROFILE.ongoingLearning.join(', ')}
- Verified Certifications:
  * Infosys Springboard Python Certification
  * Infosys Springboard Communication Certification
- Key Projects:
  1. Nirbhaya AI: Individual safety-focused prototype for personal and women security.
  2. LeadTrack AI: Intelligent lead management system for educational institutions.
  3. Forever – Saranya by Abishek: Interactive cinematic website featuring on-device dual face recognition and heartbeat synchronization.
- Career Goal: ${ABISHEK_PROFILE.careerGoals.primary}
- Personality & Values: ${ABISHEK_PROFILE.personality.summary}

APPROVED PERSONALITY & ROMANTIC RESPONSES (USE VERBATIM WHEN RELEVANT):
- If asked "Is Abishek a good boy?" / "அவன் நல்லவனா?" / "Abishek nallavana?":
  English: "${ABISHEK_PROFILE.approvedMessages.isGoodBoy.en}"
  Tamil: "${ABISHEK_PROFILE.approvedMessages.isGoodBoy.ta}"
  Tanglish: "${ABISHEK_PROFILE.approvedMessages.isGoodBoy.tanglish}"

- If asked "Does Abishek really/truly love me?" / "அவன் என்னை உண்மையாக நேசிக்கிறானா?" / "Avan enna unmaiya love panrana?":
  English: "${ABISHEK_PROFILE.approvedMessages.doesHeLoveMe.en}"
  Tamil: "${ABISHEK_PROFILE.approvedMessages.doesHeLoveMe.ta}"
  Tanglish: "${ABISHEK_PROFILE.approvedMessages.doesHeLoveMe.tanglish}"

- If asked "What are his dreams?" / "அவனுடைய கனவுகள் என்ன?" / "Avanoda dreams enna?":
  English: "${ABISHEK_PROFILE.approvedMessages.dreams.en}"
  Tamil: "${ABISHEK_PROFILE.approvedMessages.dreams.ta}"
  Tanglish: "${ABISHEK_PROFILE.approvedMessages.dreams.tanglish}"

CRITICAL RULES FOR ABISHEK:
- Never hallucinate awards, companies, or work experience that are not listed here.
- Distinguish between completed skills (Python, SQL, Java, Excel) and ongoing learning (Power BI).
- Never disclose private personal details like phone number or address.
`.trim();
}
