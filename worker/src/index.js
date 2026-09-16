const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per photo
const ZONES = ['front', 'back', 'left', 'right'];
// All photos are optional. Close-ups are kept in their own list purely for
// storage-key naming (leadId/closeup/... vs leadId/front/...).
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

// Daily social content generation (cron trigger, see wrangler.toml [triggers]).
// Rotates through a 12-day localized topic matrix by day-of-year so the same
// topic/location doesn't repeat for 12 days. Email-digest only -- this never
// posts to Instagram itself, it just gets a draft into the owner's inbox for
// review. Locations are real East Bay communities within Zone 0's service
// area, each paired with a hazard/action pair specific enough to read as
// locally researched rather than generic.
const SOCIAL_CONTENT_TOPICS = [
  {
    bucket: 'Compliance & Laws',
    location: 'Oakland Hills (Montclair & Skyline areas)',
    hazard: 'Combustible shredded bark mulch sitting directly against dry wooden structural siding.',
    action: 'Swapping out organic ground cover for smooth river rock or clean gravel borders.',
  },
  {
    bucket: 'Design & Aesthetics',
    location: 'Berkeley Hills & Kensington',
    hazard: 'Overcrowded, continuous canopy chains of oily, ember-catching ornamental plants.',
    action: "Spacing out beautiful, broad-leaf native anchors like Toyon or Manzanita 'Dr. Hurd'.",
  },
  {
    bucket: 'Seasonal Upkeep',
    location: 'Orinda & Lafayette',
    hazard: 'Massive seasonal pine needle and dry oak leaf drops piling up in hidden roof valleys and gutters.',
    action: 'Clearing out structural collection tracks before the hot autumn offshore wind events strike.',
  },
  {
    bucket: 'Structural Defense',
    location: 'Moraga',
    hazard: 'Exposed foundation and crawlspace vents inviting wind-driven sparks directly under the subfloor.',
    action: 'Retrofitting all exterior vents with 1/8-inch corrosion-resistant metal mesh screen.',
  },
  {
    bucket: 'Compliance & Laws',
    location: 'Walnut Creek & Alamo',
    hazard: "Wood privacy fences acting as direct fuel fuses leading wildfire directly up to the home's structure.",
    action: "Replacing the first 5 feet of any perimeter fence touching the house with a clean metal transition.",
  },
  {
    bucket: 'Design & Aesthetics',
    location: 'Piedmont & Rockridge',
    hazard: 'Overgrown foundation flower beds filled with oil-rich hazards like Rosemary or Juniper.',
    action: 'Replacing them with compact, moisture-rich native succulents like Canyon Live-Forever.',
  },
  {
    bucket: 'Seasonal Upkeep',
    location: 'Oakland Hills (Joaquin Miller / Woodminster)',
    hazard: 'Eucalyptus leaf litter and dry ground fuel accumulating beneath mature tree canopies.',
    action: 'Clearing out low-lying ladder fuels to create safe separation below the major tree line.',
  },
  {
    bucket: 'Structural Defense',
    location: 'Berkeley Hills',
    hazard: 'Wooden deck structures with dry leaves or storage bins tucked tightly underneath them.',
    action: 'Clearing out all under-deck voids and maintaining a clean non-combustible base beneath wood framing.',
  },
  {
    bucket: 'Compliance & Laws',
    location: 'Orinda',
    hazard: 'Misunderstanding the timeline and rules of the historic AB 3074 statewide ember-resistant mandate.',
    action: 'Breaking down the multi-year implementation window and immediate actions for local homeowners.',
  },
  {
    bucket: 'Design & Aesthetics',
    location: 'Lafayette & Moraga',
    hazard: 'The misconception that a fire-safe landscape means stripping a yard bare of green character.',
    action: 'Pairing architectural gravel pathways with resilient pollinator choices like California Buckwheat.',
  },
  {
    bucket: 'Seasonal Upkeep',
    location: 'Alamo & Danville',
    hazard: 'Dry summer weeds and unmaintained grasses encroaching heavily inside your outer 30-100ft Zone 2 boundary.',
    action: 'Mowing down roadside fuel paths and thin, dense brush lines to give arriving fire crews room to maneuver.',
  },
  {
    bucket: 'Action/Offer Promotion',
    location: 'East Bay Communities',
    hazard: 'Homeowners feeling overwhelmed and not knowing which part of their perimeter layout needs immediate fix.',
    action: 'Taking advantage of the Free 48-Hour Personalized Photo Review and Action Checklist offer.',
  },
];

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleDailySocialContent(env));
  },

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
    // No minimum: all four sides are optional, same as the close-up zone.
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

async function handleDailySocialContent(env) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const topic = SOCIAL_CONTENT_TOPICS[dayOfYear % SOCIAL_CONTENT_TOPICS.length];
  const topicLabel = `${topic.bucket} — ${topic.location}`;

  const systemPrompt = `You are the social media manager for Zone 0 Landscaping, a defensible-space and fire-adapted landscaping company in the East Bay, California. Your goal is to educate homeowners on CA Zone 0 rules, fire-adapted planting design, hardscaping, and defensible space maintenance.

Every post should point toward our free offer: a personalized 48-hour photo review and action checklist. Contact for it: hello@zone0landscaping.com or (510) 394-2590.

Tone: professional, calm, encouraging, knowledgeable about East Bay ecology. Never use scare tactics. Never say "certified", "compliant", "guaranteed", or "official inspection" -- this is educational content, not a certification.

Today's target audience: homeowners in ${topic.location}.
Content bucket: ${topic.bucket}
Specific hazard to address: ${topic.hazard}
Solution/action to recommend: ${topic.action}

You must output exactly two blocks, in this exact format, and nothing else -- no intro, no markdown fences, no extra commentary:

[INSTAGRAM_POST]
(a hook line referencing ${topic.location}, 3 short bullet points built from the hazard and action above, a call-to-action mentioning hello@zone0landscaping.com or (510) 394-2590, and exactly 5 relevant hashtags)

[IMAGE_PROMPT]
(a detailed photorealistic prompt for a text-to-image generator -- a crisp daylight architectural photo of a home's 0-5 ft perimeter with non-combustible ground cover (gravel, pavers, decomposed granite) or fire-resistant native plants, matching the action described above. No fire, smoke, ash, or damage -- aspirational only.)`;

  let caption;
  let imagePrompt;
  try {
    const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate today's ${topicLabel} post.` },
      ],
      max_tokens: 800,
    });

    const raw = (aiResponse.response || '').trim();
    // Delimited text, not JSON -- a smaller model reliably hitting exact JSON
    // string-escaping rules (multi-line captions, embedded quotes) is not a
    // safe bet; this format degrades gracefully if it wanders slightly.
    const postMatch = raw.match(/\[INSTAGRAM_POST\]\s*([\s\S]*?)\s*(?=\[IMAGE_PROMPT\]|$)/i);
    const promptMatch = raw.match(/\[IMAGE_PROMPT\]\s*([\s\S]*)/i);
    caption = postMatch ? postMatch[1].trim() : '';
    imagePrompt = promptMatch ? promptMatch[1].trim() : '';
    if (!caption || !imagePrompt) throw new Error('AI response missing expected [INSTAGRAM_POST]/[IMAGE_PROMPT] sections. Raw response: ' + raw.slice(0, 500));
  } catch (e) {
    await sendDailySocialEmail(env, {
      subject: '⚠️ Zone 0 daily content generation failed',
      html: `<p>Today's automated social content draft (${escapeHtml(topicLabel)}) failed to generate.</p><pre>${escapeHtml(String(e))}</pre>`,
    });
    return;
  }

  await sendDailySocialEmail(env, {
    subject: `☀️ Zone 0 daily Instagram draft — ${topicLabel}`,
    html: `
      <h2>Today's topic: ${escapeHtml(topicLabel)}</h2>
      <p><strong>Instagram caption (copy/paste):</strong></p>
      <pre style="background:#f4f4f4;padding:12px;white-space:pre-wrap;">${escapeHtml(caption)}</pre>
      <p><strong>Image prompt (paste into your image generator):</strong></p>
      <pre style="background:#e4e4e4;padding:12px;white-space:pre-wrap;">${escapeHtml(imagePrompt)}</pre>
      <p style="color:#888;font-size:13px;">This is a draft only -- nothing was posted automatically. Review, generate the image, and post manually.</p>
    `,
  });
}

async function sendDailySocialEmail(env, { subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: env.NOTIFY_EMAIL,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
