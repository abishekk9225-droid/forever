/**
 * FOREVER – SARANYA BY ABISHEK: OFFICIAL WEBSITE KNOWLEDGE BASE
 * 
 * Provides complete architectural, navigational, and feature documentation
 * for ABISHEK AI to guide users through the website experience.
 */

export const WEBSITE_ARCHITECTURE = {
  title: "Forever – Saranya by Abishek",
  theme: "Cinematic Romantic Experience with Human Heartbeat & Face Vision",
  
  // Security & Authentication Gate
  initialAuthentication: {
    firstScreen: "Camera Presence & Privacy Protection ❤️",
    purpose: "Ensures an authentic private experience with real-time on-device presence detection.",
    features: [
      "100% On-Device Privacy: Live video analysis runs entirely in the browser without sending frames to remote servers.",
      "Mobile Phone Blackout Shield: If an external camera or phone is pointed towards the screen, the display immediately blacks out to protect private moments.",
      "Two Consent Checkboxes: Photo alert consent and mobile privacy monitoring.",
      "Mandatory Camera Action: 'Allow & Enter Journey' requests the browser camera.",
    ],
    faceRecognitionScreen: {
      title: "Face Authentication ❤️",
      purpose: "Compares live camera feed against registered identities (Abishek or Saranya).",
      rule: "Dual-Face Recognition: Only ONE authorized person needs to be present (Abishek or Saranya).",
      passcodeFallback: {
        passcode: "AS0326",
        hint: "AS + birthdate of both persons (days only, not month or year).",
        behavior: "Entering the correct passcode instantly unlocks the journey without requiring camera scanning.",
      },
    },
  },

  // Scene Walkthrough & Purposes
  scenes: [
    {
      id: "INTRO",
      name: "Heartbeat Intro & Preparation",
      purpose: "Syncs the user's emotional tempo with an animated glowing 3D heart, ambient sound, and sensory preparation.",
      howToProceed: "Tap or hold the glowing heart to align your pulse and step into the journey.",
    },
    {
      id: "PHONE_CALL",
      name: "Incoming Romantic Call",
      purpose: "Simulates an authentic incoming phone call with realistic ringtone, caller profile, and custom audio.",
      howToProceed: "Click the green 'Accept' button to answer the call, or tap 'Decline' to receive a gentle callback reminder.",
    },
    {
      id: "ASK_DIALOGUE",
      name: "13 Cinematic Tamil Dialogues",
      purpose: "Presents 13 deeply meaningful, poetic Tamil dialogues reflecting personal memories and sincere affection.",
      howToProceed: "Tap 'Next' or the screen to proceed through each dialogue in sequence.",
    },
    {
      id: "MEMORIES",
      name: "Secret Memories Gallery",
      purpose: "An interactive polaroid gallery displaying precious moments, captured photos, and nostalgic reflections.",
      howToProceed: "Swipe or click through memory cards to view each milestone and its personalized note.",
    },
    {
      id: "GAME",
      name: "Romantic Adventure Mini-Game",
      purpose: "An interactive journey gathering glowing star fragments, navigating emotional choices, and unlocking heartfelt messages.",
      howToProceed: "Follow the on-screen controls, gather glowing fragments, and unlock the golden gate.",
    },
    {
      id: "LETTER",
      name: "Interactive Love Letter & Envelopes",
      purpose: "A handwritten digital letter with opening wax seals and interactive 'Open When' emotional envelopes.",
      howToProceed: "Click the envelope seal to open and read the heartfelt letter.",
    },
    {
      id: "MELT",
      name: "Warmth Melt Scene",
      purpose: "An interactive touch/mouse canvas where gentle gestures melt frosted glass into glowing romantic hearts.",
      howToProceed: "Move your cursor or finger across the frosted canvas to melt the barrier and reveal the warmth underneath.",
    },
    {
      id: "CONFESSION",
      name: "Suspense Proposal Flow",
      purpose: "The emotional climax of the experience asking 'Will You Marry Me?' with an interactive runaway 'No' button.",
      howToProceed: "Tap 'Yes' to accept the lifelong proposal and trigger the grand celebration.",
    },
    {
      id: "CELEBRATION",
      name: "Celebration Reveal",
      purpose: "Joyous fireworks, colorful confetti showers, celebratory music, and heartfelt affirmations.",
      howToProceed: "Enjoy the celebration and proceed to the unlockable climax activities.",
    },
    {
      id: "AI_PENCIL",
      name: "AI Pencil Drawing Scene",
      purpose: "Generates an exquisite hand-drawn pencil portrait sketch surrounded by gently drifting rose petals.",
      howToProceed: "Watch the artistic sketch materialize on the canvas.",
    },
    {
      id: "UNSENT_MESSAGE",
      name: "Unsent Messages Vault",
      purpose: "Reveals intimate unspoken words and heartfelt confessions kept safe until this very moment.",
      howToProceed: "Tap each message capsule to read the unspoken thoughts.",
    },
    {
      id: "LOCK_REVEAL",
      name: "Fingerprint Security Lock",
      purpose: "Interactive fingerprint scanner granting exclusive access to the inner promise vault.",
      howToProceed: "Press and hold the fingerprint scanner until the biometric circle completes.",
    },
    {
      id: "LOVE_SURVEY",
      name: "Love Survey Questions",
      purpose: "Playful relationship survey questions exploring shared habits and favorite memories.",
      howToProceed: "Select your answers for each question to uncover customized compatibility reflections.",
    },
    {
      id: "QUIZ",
      name: "Post-Proposal Love Quiz",
      purpose: "A lighthearted quiz celebrating the unique bond, funny stories, and inside jokes.",
      howToProceed: "Answer the quiz questions to receive your score.",
    },
    {
      id: "PROMISE_VAULT",
      name: "Seven Eternal Promises",
      purpose: "A sacred vault containing 7 lifetime vows written exclusively for Saranya.",
      howToProceed: "Unlock each promise card to read the lifelong dedication.",
    },
    {
      id: "CERTIFICATE",
      name: "Official Love Certificate",
      purpose: "A formal, beautifully rendered digital certificate of unconditional love with gold seals and download options.",
      howToProceed: "Review the certificate and click 'Download Certificate' to save a high-resolution copy.",
    },
    {
      id: "FINALE",
      name: "Spring Coil Finale & Secret Snapshot",
      purpose: "The grand closing scene featuring an interactive 3D spring coil, final secret message card, and keepsake memory snapshot.",
      howToProceed: "Interact with the 3D coil and reveal the final hidden card.",
    },
  ],

  // Audio Controls & Easter Eggs
  audioSystem: {
    description: "Multi-layered ambient audio engine adjusting gain and soundtrack based on scene emotional intensity.",
    controls: "Floating audio indicator allows muting or playing ambient music tracks.",
  },
};

/**
 * Returns a grounded summary text of the website architecture for LLM system prompting.
 */
export function getGroundedWebsitePrompt(currentSceneId = null) {
  let contextSnippet = "";
  if (currentSceneId) {
    const active = WEBSITE_ARCHITECTURE.scenes.find((s) => s.id === currentSceneId);
    if (active) {
      contextSnippet = `\nCURRENT ACTIVE SCENE USER IS VIEWING: "${active.name}" (${active.id})\nPurpose: ${active.purpose}\nHow to navigate: ${active.howToProceed}\n`;
    }
  }

  return `
OFFICIAL WEBSITE STRUCTURE & NAVIGATION GUIDE:
${contextSnippet}
1. Initial Screen: "Camera Presence & Privacy Protection ❤️"
   - Requests front camera for presence.
   - 100% on-device local processing; privacy blackout shield activates if a secondary phone is detected.
2. Face Authentication:
   - Uses dual face recognition for Abishek or Saranya. Either person unlocks.
   - Passcode fallback: "AS0326" (Hint: AS + birthdate of both persons, days only).
3. 23 Total Scenes including:
   - Heartbeat Intro (Sensory pulse alignment)
   - Phone Call Scene (Incoming realistic call simulation)
   - 13 Tamil Dialogues (Poetic romantic progression)
   - Memories Gallery (Polaroid interactive photo cards)
   - Romantic Adventure Game (Star fragments mini-game)
   - Interactive Love Letter (Handwritten digital letter)
   - Warmth Melt Scene (Touch melting frozen glass)
   - Suspense Proposal Flow ("Will You Marry Me?" climax with running "No" button)
   - Celebration Reveal (Fireworks & confetti)
   - AI Pencil Drawing (Real-time pencil portrait sketch)
   - Unsent Messages Vault (Unspoken feelings)
   - Fingerprint Lock & Seven Promises Vault
   - Official Love Certificate (Downloadable keepsake)
   - Spring Coil Finale
4. Audio & Controls:
   - Floating audio pill lets users mute/unmute soundtrack.
   - Bottom-right corner houses interactive easter eggs.
`.trim();
}

