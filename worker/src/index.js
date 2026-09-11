const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per photo
const ZONES = ['front', 'back', 'left', 'right'];
// Optional zones are uploaded and stored exactly like the required sides, but
// they are deliberately kept out of ZONES so they can neither satisfy nor block
// the four-sides-required rule.
const OPTIONAL_ZONES = ['closeup'];
const MAX_FILES_PER_ZONE = 5;
// Area-of-interest slugs. Anything not on this list is dropped silently rather
// than echoed back to the submitter.
const AREA_SLUGS = ['zone0', 'plants', 'mulch', 'fence_deck', 'general', 'not_sure'];
const AREA_LABELS = {
  zone0: 'The first 5 feet around the house',
  plants: 'Plants and shrubs near the structure',
  mulch: 'Ground cover and mulch',
  fence_deck: 'Fences, decks, and attached structures',
  general: 'General overall review',
  not_sure: 'Not sure — tell me what to look at',
};
const MIN_SUBMIT_TIME_MS = 3000; // reject submissions faster than a human could plausibly fill the form
const CONTACT_SUBJECT_SLUGS = ['general', 'photo-check', 'quote', 'other'];
const CONTACT_SUBJECT_LABELS = {
  general: 'General question',
  'photo-check': 'Photo check follow-up',
  quote: 'Request a quote',
  other: 'Something else',
};
const CONTACT_MESSAGE_MAX = 500; // mirrors js/contact-form.js's MESSAGE_MAX

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

    if (url.pathname === '/contact' && request.method === 'POST') {
      return handleContact(request, env, corsHeaders);
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
  const address = field(form, 'address');
  const notes = field(form, 'notes');
  const areas = parseAreas(form);

  const errors = [];
  if (!name) errors.push('Name is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (!phone || phone.replace(/\D/g, '').length < 7) errors.push('A valid phone number is required.');
  if (!address) errors.push('Property address is required.');

  const filesByZone = {};
  for (const zone of ZONES) {
    const files = form.getAll(`photos_${zone}`).filter((f) => f && typeof f === 'object' && 'arrayBuffer' in f && f.size > 0);
    filesByZone[zone] = files;
    if (files.length < 1) errors.push(`At least 1 photo of the ${zone} is required.`);
    if (files.length > MAX_FILES_PER_ZONE) errors.push(`No more than ${MAX_FILES_PER_ZONE} photos are allowed per side.`);
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) errors.push(`"${f.name}" is not a supported image type.`);
      if (f.size > MAX_FILE_SIZE) errors.push(`"${f.name}" is larger than 8MB.`);
    }
  }

  for (const zone of OPTIONAL_ZONES) {
    const files = form.getAll(`photos_${zone}`).filter((f) => f && typeof f === 'object' && 'arrayBuffer' in f && f.size > 0);
    filesByZone[zone] = files;
    // No minimum: these are optional by design.
    if (files.length > MAX_FILES_PER_ZONE) errors.push(`No more than ${MAX_FILES_PER_ZONE} close-up photos are allowed.`);
    for (const f of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) errors.push(`"${f.name}" is not a supported image type.`);
      if (f.size > MAX_FILE_SIZE) errors.push(`"${f.name}" is larger than 8MB.`);
    }
  }

  if (errors.length) {
    return json({ ok: false, error: errors.join(' ') }, 400, corsHeaders);
  }

  const leadId = crypto.randomUUID();
  const uploadedKeys = [];
  try {
    for (const zone of ZONES.concat(OPTIONAL_ZONES)) {
      for (const f of filesByZone[zone] || []) {
        const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const key = `${leadId}/${zone}/${crypto.randomUUID()}.${ext}`;
        await env.PHOTO_BUCKET.put(key, f.stream(), {
          httpMetadata: { contentType: f.type },
        });
        uploadedKeys.push(key);
      }
    }
  } catch (e) {
    return json({ ok: false, error: 'Photo upload failed. Please try again.' }, 502, corsHeaders);
  }

  const photoUrls = uploadedKeys.map((k) => `${new URL(request.url).origin}/photo/${k}`);

  try {
    await insertLeadRecord(env, { leadId, name, email, phone, address, notes, areas, uploadedKeys });
  } catch (e) {
    // The lead + photos are already safely stored in R2 even if the review-portal
    // database write failed -- this must never block the homeowner's submission.
  }

  try {
    await sendNotification(env, { leadId, name, email, phone, address, notes, areas, photoUrls });
  } catch (e) {
    // Lead + photos are already safely stored in R2 even though the notification email failed.
    return json({ ok: true, warning: 'Received, but the confirmation email failed to send.' }, 200, corsHeaders);
  }

  return json({ ok: true }, 200, corsHeaders);
}

async function handleContact(request, env, corsHeaders) {
  if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
    return json({ ok: false, error: 'Origin not allowed.' }, 403, corsHeaders);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ ok: false, error: 'Could not read the submitted form.' }, 400, corsHeaders);
  }

  // Honeypot: the client never sends this field filled in. A direct API
  // call that fills it gets a fake-success response, same as /submit.
  if ((body.companyWebsite || '').toString().trim() !== '') {
    return json({ ok: true }, 200, corsHeaders);
  }

  const fullName = (body.fullName || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const phone = (body.phone || '').toString().trim();
  const subject = (body.subject || '').toString().trim();
  const message = (body.message || '').toString();

  const errors = [];
  if (!fullName) errors.push('Full name is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (phone && !/^[\d\s()+\-.]{7,20}$/.test(phone)) errors.push('Enter a valid phone number.');
  if (!CONTACT_SUBJECT_SLUGS.includes(subject)) errors.push('Choose a topic.');
  if (!message.trim() || message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  if (message.length > CONTACT_MESSAGE_MAX) errors.push(`Message must be ${CONTACT_MESSAGE_MAX} characters or fewer.`);

  if (errors.length) {
    return json({ ok: false, error: errors.join(' ') }, 400, corsHeaders);
  }

  try {
    await sendContactNotification(env, { fullName, email, phone, subject, message });
  } catch (e) {
    return json({ ok: false, error: 'Could not send your message. Please try again or email hello@zone0landscaping.com directly.' }, 502, corsHeaders);
  }

  return json({ ok: true }, 200, corsHeaders);
}

async function insertLeadRecord(env, lead) {
  if (!env.DB) return; // D1 binding not configured on this environment
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO leads (id, name, email, phone, address, notes, areas, photo_keys, status, submitted_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  )
    .bind(lead.leadId, lead.name, lead.email, lead.phone, lead.address, lead.notes || null, lead.areas && lead.areas.length ? lead.areas.join(',') : null, JSON.stringify(lead.uploadedKeys), now, now)
    .run();
}

function field(form, key) {
  return (form.get(key) || '').toString().trim();
}

// Accepts repeated `areas` entries or a single comma-joined value, keeps only
// known slugs, and de-duplicates while preserving AREA_SLUGS order.
function parseAreas(form) {
  const raw = form
    .getAll('areas')
    .flatMap((v) => (v || '').toString().split(','))
    .map((v) => v.trim());
  return AREA_SLUGS.filter((slug) => raw.includes(slug));
}

async function sendNotification(env, lead) {
  const text = [
    'New Zone 0 Photo Check lead',
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Address: ${lead.address}`,
    `Areas of interest: ${lead.areas && lead.areas.length ? lead.areas.map((a) => AREA_LABELS[a] || a).join('; ') : '(none selected)'}`,
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
      subject: `New Photo Check lead — ${lead.name} (${lead.address})`,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}

async function sendContactNotification(env, contact) {
  const text = [
    'New Zone 0 contact form message',
    '',
    `Name: ${contact.fullName}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone || '(none)'}`,
    `Subject: ${CONTACT_SUBJECT_LABELS[contact.subject] || contact.subject}`,
    '',
    'Message:',
    contact.message,
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
      reply_to: contact.email,
      subject: `New contact form message — ${contact.fullName} (${CONTACT_SUBJECT_LABELS[contact.subject] || contact.subject})`,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}
