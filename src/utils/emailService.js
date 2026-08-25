const SERVICE_ID = 'service_8z99rkh';
const TEMPLATE_ID = 'template_2op6g7i';
const PUBLIC_KEY = 'VUHgOes-Xiqh0fnh9';
const ADMIN_EMAIL = 'abishek.k.officl@gmail.com';

/**
 * Sends a notification email via EmailJS with robust error handling and logging.
 * 
 * @param {Object} params
 * @param {string} params.title - The title or subject line parameter for the email.
 * @param {string} params.message - The main content or message of the email.
 * @returns {Promise<boolean>} Resolves to true if the email is successfully sent.
 */
export const sendEmail = async ({ title, message }) => {
  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      name: 'Saranya ❤️',
      title: title,
      message: message,
      time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      email: ADMIN_EMAIL,
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ EmailJS Send Failure:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        payload,
      });
      throw new Error(`EmailJS failed with status ${response.status}: ${errorText}`);
    }

    console.log('✅ EmailJS Sent Successfully:', { title, message });
    return true;
  } catch (error) {
    console.error('❌ EmailJS Network/Execution Error:', error);
    throw error;
  }
};
