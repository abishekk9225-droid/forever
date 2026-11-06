/**
 * ABISHEK K. - OFFICIAL VERIFIED PERSONAL KNOWLEDGE BASE
 * 
 * Strict Grounding Rules:
 * - Only verified factual information is recorded here.
 * - Completed skills, ongoing learning, and future goals are explicitly distinguished.
 * - No invented awards, unverified experience, or private personal data.
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

  // Career ambitions and future vision
  careerGoals: {
    primary: "To build an impactful career in Artificial Intelligence and the global technology industry.",
    focusAreas: "Developing production-grade AI systems, intelligent automation, and human-centric software.",
    status: "Aspiring AI Engineer / Undergraduate Student",
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
CRITICAL RULES FOR ABISHEK:
- Never hallucinate awards, companies, or work experience that are not listed here.
- Distinguish between completed skills (Python, SQL, Java, Excel) and ongoing learning (Power BI).
- Never disclose private personal details like phone number or address.
`.trim();
}

