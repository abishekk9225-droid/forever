// Safe test email script for EmailJS verification
// Usage: node scripts/test-email.js
import fs from 'fs';
import path from 'path';

// Parse .env if available
const envPath = path.resolve(process.cwd(), '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) {
        envVars[key.trim()] = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
      }
    }
  });
}

const serviceId = envVars.VITE_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || 'service_8z99rkh';
const templateId = envVars.VITE_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || 'template_z7jgo2n';
const publicKey = envVars.VITE_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY || envVars.EMAILJS_PRIVATE_KEY;
const recipient = envVars.VITE_ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || 'kabishekkabishek677@gmail.com';

console.log('--- EmailJS Configuration Test ---');
console.log('Service ID:', serviceId);
console.log('Template ID:', templateId);
console.log('Recipient:', recipient || '(Not configured)');
console.log('Public Key Configured:', Boolean(publicKey));
console.log('Private Key Configured:', Boolean(privateKey));

if (!recipient) {
  console.error('❌ Error: Recipient email address is not configured. Aborting test.');
  process.exit(1);
}

if (!publicKey && !privateKey) {
  console.error('❌ Error: Neither Public Key nor Private Key is configured. Aborting test.');
  process.exit(1);
}

const payload = {
  service_id: serviceId,
  template_id: templateId,
  user_id: publicKey,
  template_params: {
    to_email: recipient,
    email: recipient,
    recipient: recipient,
    name: 'Forever Saranya System',
    title: 'EmailJS Delivery Verification Test ❤️',
    message: 'This is a single verification test email confirming that your new EmailJS credentials and delivery pipeline are working properly.',
    time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  },
};

if (privateKey) {
  payload.accessToken = privateKey;
}

console.log('\nSending single test email to recipient...');

try {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ForeverSaranya/1.0',
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();

  console.log('EmailJS API Status:', response.status, response.statusText);
  console.log('EmailJS API Response:', bodyText);

  if (response.ok) {
    console.log('\n✅ EmailJS API accepted the message for delivery.');
    console.log('👉 Please check recipient inbox and spam folder to confirm receipt.');
  } else {
    console.log('\n❌ EmailJS API returned an error:', bodyText);
  }
} catch (err) {
  console.error('\n❌ Network error while communicating with EmailJS:', err.message);
}

