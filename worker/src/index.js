const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per photo
const MAX_FILES = 3;
const MIN_SUBMIT_TIME_MS = 3000; // reject submissions faster than a human could plausibly fill the form

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname.startsWith('/photo/') && request.method === 'GET') {
      return servePhoto(url, env);
    }

    if (url.pathname === '/submit' && request.method === 'POST') {
      return handleSubmit(request, env, corsHeaders);
    }

    return json({ ok: false, error: 'Not found' }, 404, corsHeaders);
  },
};

function buildCorsHeaders(origin, allowedOrigin) {
  return {
    'Access-Control-Allow-Origin': origin === allowedOrigin ? allowedOrigin : 'null',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

async function servePhoto(url, env) {
  const key = decodeURIComponent(url.pathname.replace(/^\/photo\//, ''));
  const obj = await env.PHOTO_BUCKET.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'private, max-age=31536000',
    },
  });
}

async function handleSubmit(request, env, corsHeaders) {
  if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
    return json({ ok: false, error: 'Origin not allowed.' }, 403, corsHeaders);
  }

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return json({ ok: false, error: 'Could not read the submitted form.' }, 400, corsHeaders);
  }

  // Honeypot: real visitors never fill this hidden field in.
  if (field(form, 'website') !== '') {
    return json({ ok: true }, 200, corsHeaders);
  }

  const loadedAt = Number(form.get('loadedAt') || 0);
  if (!loadedAt || Date.now() - loadedAt < MIN_SUBMIT_TIME_MS) {
    return json({ ok: false, error: 'Please try again.' }, 400, corsHeaders);
  }

  const name = field(form, 'name');
  const email = field(form, 'email');
  const phone = field(form, 'phone');
  const city = field(form, 'city');
  const notes = field(form, 'notes');

  const errors = [];
  if (!name) errors.push('Name is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (!phone || phone.replace(/\D/g, '').length < 7) errors.push('A valid phone number is required.');
  if (!city) errors.push('City is required.');

  const files = form.getAll('photos').filter((f) => f && typeof f === 'object' && 'arrayBuffer' in f && f.size > 0);
  if (files.length < 1) errors.push('At least 1 photo is required.');
  if (files.length > MAX_FILES) errors.push(`No more than ${MAX_FILES} photos are allowed.`);
  for (const f of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(f.type)) errors.push(`"${f.name}" is not a supported image type.`);
    if (f.size > MAX_FILE_SIZE) errors.push(`"${f.name}" is larger than 8MB.`);
  }

  if (errors.length) {
    return json({ ok: false, error: errors.join(' ') }, 400, corsHeaders);
  }

  const leadId = crypto.randomUUID();
  const uploadedKeys = [];
  try {
    for (const f of files) {
      const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const key = `${leadId}/${crypto.randomUUID()}.${ext}`;
      await env.PHOTO_BUCKET.put(key, f.stream(), {
        httpMetadata: { contentType: f.type },
      });
      uploadedKeys.push(key);
    }
  } catch (e) {
    return json({ ok: false, error: 'Photo upload failed. Please try again.' }, 502, corsHeaders);
  }

  const photoUrls = uploadedKeys.map((k) => `${new URL(request.url).origin}/photo/${k}`);

  try {
    await sendNotification(env, { leadId, name, email, phone, city, notes, photoUrls });
  } catch (e) {
    // Lead + photos are already safely stored in R2 even though the notification email failed.
    return json({ ok: true, warning: 'Received, but the confirmation email failed to send.' }, 200, corsHeaders);
  }

  return json({ ok: true }, 200, corsHeaders);
}

function field(form, key) {
  return (form.get(key) || '').toString().trim();
}

async function sendNotification(env, lead) {
  const text = [
    'New Zone 0 Photo Check lead',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `City: ${lead.city}`,
    `Notes: ${lead.notes || '(none)'}`,
    '',
    `Lead ID: ${lead.leadId}`,
    'Photos:',
    ...lead.photoUrls.map((u, i) => `  ${i + 1}. ${u}`),
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: env.NOTIFY_EMAIL,
      reply_to: lead.email,
      subject: `New Photo Check lead — ${lead.name} (${lead.city})`,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}
