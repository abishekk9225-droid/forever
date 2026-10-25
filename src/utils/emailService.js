const SERVICE_ID = 'service_uuiv4gh';
const TEMPLATE_ID = 'template_vt6ym7p';
const PUBLIC_KEY = '2c4HmKBCnIfDDBQ4U';
const ADMIN_EMAIL = 'kabishekkabishek677@gmail.com';

/**
 * Uploads an image blob to a fast, reliable temporary host (tmpfiles.org with filebin.net fallback)
 * to provide a direct image link in email bodies.
 */
const uploadImageToHost = async (blob, filename = 'snapshot.jpg') => {
  // Strategy 1: tmpfiles.org
  try {
    const formData = new FormData();
    formData.append('file', blob, filename);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.url) {
        const pageUrl = data.data.url;
        const directUrl = pageUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
        return { pageUrl, directUrl };
      }
    }
  } catch (e) {
    console.warn('tmpfiles.org image upload failed:', e);
  }

  // Strategy 2: filebin.net fallback
  try {
    const binId = `saranya-snapshot-${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://filebin.net/${binId}/${filename}`, {
      method: 'POST',
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
      },
      body: blob,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok || res.status === 201) {
      const directUrl = `https://filebin.net/${binId}/${filename}`;
      return { pageUrl: directUrl, directUrl };
    }
  } catch (e) {
    console.warn('filebin.net fallback upload failed:', e);
  }

  return null;
};

/**
 * Sends a notification email via EmailJS with attachment and multipart support.
 * 
 * @param {Object} params
 * @param {string} params.title - The title or subject line parameter for the email.
 * @param {string} params.message - The main content or message of the email.
 * @param {Blob|File} [params.imageBlob] - Optional camera/photo image blob to attach.
 * @param {string} [params.filename] - Filename for the attached image.
 * @returns {Promise<boolean>} Resolves to true if the email is successfully sent.
 */
export const sendEmail = async ({
  title,
  message,
  attachments,
  imageBlob,
  filename = 'snapshot.jpg',
  ...extraParams
}) => {
  const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. If an imageBlob is provided, upload for direct URL access
  let directImageUrl = '';
  let pageImageUrl = '';
  if (imageBlob instanceof Blob) {
    const uploadRes = await uploadImageToHost(imageBlob, filename);
    if (uploadRes?.directUrl) {
      directImageUrl = uploadRes.directUrl;
      pageImageUrl = uploadRes.pageUrl;
    }
  }

  // 2. Build complete message including direct image link if available
  let enhancedMessage = message || '';
  if (directImageUrl) {
    enhancedMessage = [
      enhancedMessage,
      '',
      '📸 Captured Camera Snapshot:',
      `👉 Direct Photo Link: ${directImageUrl}`,
      pageImageUrl && pageImageUrl !== directImageUrl ? `🌐 Web Page: ${pageImageUrl}` : '',
    ].filter(Boolean).join('\n');
  }

  // 3. Attempt multipart send-form via EmailJS when imageBlob is present
  if (imageBlob instanceof Blob) {
    try {
      const formData = new FormData();
      formData.append('service_id', SERVICE_ID);
      formData.append('template_id', TEMPLATE_ID);
      formData.append('user_id', PUBLIC_KEY);
      formData.append('title', title);
      formData.append('name', 'Saranya ❤️');
      formData.append('message', enhancedMessage);
      formData.append('time', formattedTime);
      formData.append('email', ADMIN_EMAIL);
      formData.append('to_email', ADMIN_EMAIL);
      formData.append('recipient', ADMIN_EMAIL);

      if (directImageUrl) {
        formData.append('image_url', directImageUrl);
        formData.append('photo_url', directImageUrl);
        formData.append('snapshot_url', directImageUrl);
      }

      // Standard EmailJS attachment parameter names
      formData.append('content', imageBlob, filename);
      formData.append('attachment', imageBlob, filename);
      formData.append('my_file', imageBlob, filename);
      formData.append('image', imageBlob, filename);

      for (const [key, val] of Object.entries(extraParams)) {
        if (typeof val === 'string' || typeof val === 'number') {
          formData.append(key, String(val));
        }
      }

      const formRes = await fetch('https://api.emailjs.com/api/v1.0/email/send-form', {
        method: 'POST',
        body: formData,
      });

      if (formRes.ok) {
        console.log('✅ EmailJS Sent Successfully (with attachment):', { title, directImageUrl });
        return true;
      } else {
        const errText = await formRes.text();
        console.warn('send-form returned non-ok status, falling back to JSON send:', errText);
      }
    } catch (err) {
      console.warn('send-form failed, falling back to JSON send:', err);
    }
  }

  // 4. Standard / Fallback JSON send via /email/send
  const templateParams = {
    name: 'Saranya ❤️',
    title: title,
    message: enhancedMessage,
    time: formattedTime,
    email: ADMIN_EMAIL,
    to_email: ADMIN_EMAIL,
    recipient: ADMIN_EMAIL,
    ...(directImageUrl ? { image_url: directImageUrl, photo_url: directImageUrl, snapshot_url: directImageUrl } : {}),
    ...(attachments && attachments.length > 0 ? { attachments } : {}),
    ...extraParams,
  };

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: templateParams,
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

    console.log('✅ EmailJS Sent Successfully:', { title, message: enhancedMessage });
    return true;
  } catch (error) {
    console.error('❌ EmailJS Network/Execution Error:', error);
    throw error;
  }
};
