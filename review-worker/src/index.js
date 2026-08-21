const CATEGORIES = [
  { key: 'landscape_plants', label: 'Landscape / Plants' },
  { key: 'organic_combustible', label: 'Organic / Combustible Materials' },
  { key: 'structure_foundation', label: 'Structure / Foundation' },
  { key: 'hardscape_ground', label: 'Hardscape / Ground Surface' },
  { key: 'trees_overhead', label: 'Trees / Overhead Vegetation' },
  { key: 'maintenance_risk', label: 'Maintenance / Ongoing Risk' },
];

const STATUS_LABELS = {
  new: 'New',
  in_review: 'In Review',
  complete: 'Complete',
  follow_up: 'Follow-up',
  closed: 'Closed',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const access = await verifyAccessJwt(request, env);
    if (!access) {
      return new Response('Access denied.', { status: 403 });
    }

    try {
      if (url.pathname === '/review/' || url.pathname === '/review') {
        return handleQueue(request, env);
      }

      const photoMatch = url.pathname.match(/^\/review\/photo\/([^/]+)\/([^/]+)$/);
      if (photoMatch && request.method === 'GET') {
        return handlePhoto(env, photoMatch[1], photoMatch[2]);
      }

      const leadMatch = url.pathname.match(/^\/review\/lead\/([^/]+)$/);
      if (leadMatch && request.method === 'GET') {
        return handleLeadDetail(env, leadMatch[1]);
      }

      const draftMatch = url.pathname.match(/^\/review\/lead\/([^/]+)\/save-draft$/);
      if (draftMatch && request.method === 'POST') {
        return handleSaveDraft(request, env, draftMatch[1]);
      }

      const completeMatch = url.pathname.match(/^\/review\/lead\/([^/]+)\/complete$/);
      if (completeMatch && request.method === 'POST') {
        return handleComplete(request, env, completeMatch[1]);
      }

      const sendMatch = url.pathname.match(/^\/review\/lead\/([^/]+)\/send$/);
      if (sendMatch && request.method === 'POST') {
        return handleSend(request, env, sendMatch[1]);
      }

      const followUpMatch = url.pathname.match(/^\/review\/lead\/([^/]+)\/follow-up$/);
      if (followUpMatch && request.method === 'POST') {
        return handleFollowUp(request, env, followUpMatch[1]);
      }

      return new Response('Not found', { status: 404 });
    } catch (e) {
      return new Response('Internal error: ' + e.message, { status: 500 });
    }
  },
};

// ---------------------------------------------------------------------------
// Access (Cloudflare Zero Trust) JWT verification -- defense-in-depth on top
// of Access already gating this Worker at the edge. Fails closed: any missing
// config, malformed token, bad signature, wrong audience, or expiry means
// "not authenticated," never "let it through."
// ---------------------------------------------------------------------------

async function verifyAccessJwt(request, env) {
  // Local-dev-only escape hatch, set via review-worker/.dev.vars (gitignored,
  // never present in the deployed wrangler.toml vars or as a secret) so the
  // portal can be exercised with `wrangler dev` before Access exists.
  if (env.DEV_BYPASS_ACCESS === '1') return { email: 'dev-local@zone0landscaping.com' };

  if (!env.ACCESS_AUD || !env.ACCESS_TEAM_DOMAIN) return null;

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;

  let header, payload;
  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64));
    payload = JSON.parse(base64UrlDecodeToString(payloadB64));
  } catch (e) {
    return null;
  }

  if (!Array.isArray(payload.aud) || !payload.aud.includes(env.ACCESS_AUD)) return null;
  if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

  let certs;
  try {
    const certsRes = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
    if (!certsRes.ok) return null;
    certs = await certsRes.json();
  } catch (e) {
    return null;
  }

  const jwk = (certs.keys || []).find((k) => k.kid === header.kid);
  if (!jwk) return null;

  let cryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
  } catch (e) {
    return null;
  }

  const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = base64UrlDecodeToBytes(sigB64);

  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, signedData);
  if (!valid) return null;

  return { email: payload.email };
}

function base64UrlDecodeToString(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
}

function base64UrlDecodeToBytes(b64url) {
  const binary = base64UrlDecodeToString(b64url);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

async function handleQueue(request, env) {
  const { results } = await env.DB.prepare(
    `SELECT id, name, city, status, submitted_at FROM leads ORDER BY submitted_at DESC`
  ).all();

  const rows = results
    .map(
      (lead) => `
      <tr>
        <td class="px-4 py-3"><a href="/review/lead/${escapeAttr(lead.id)}" class="text-sage-dark font-semibold hover:underline">${escapeHtml(lead.name)}</a></td>
        <td class="px-4 py-3">${escapeHtml(lead.city)}</td>
        <td class="px-4 py-3 text-stone-500">${escapeHtml(formatDate(lead.submitted_at))}</td>
        <td class="px-4 py-3">${statusBadge(lead.status)}</td>
      </tr>`
    )
    .join('');

  const body = `
    <h1 class="text-2xl font-bold text-stone-900 mb-6">Photo Check Leads</h1>
    ${
      results.length === 0
        ? `<p class="text-stone-500">No leads yet.</p>`
        : `<table class="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
            <thead class="bg-stone-100 text-left text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th class="px-4 py-3">Lead</th>
                <th class="px-4 py-3">City</th>
                <th class="px-4 py-3">Submitted</th>
                <th class="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200 bg-white">${rows}</tbody>
          </table>`
    }
  `;

  return htmlResponse(pageShell('Photo Check Leads', body));
}

async function handleLeadDetail(env, id) {
  const lead = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?`).bind(id).first();
  if (!lead) return new Response('Lead not found', { status: 404 });

  const photoKeys = JSON.parse(lead.photo_keys || '[]');
  const analysis = lead.analysis_json ? JSON.parse(lead.analysis_json) : {};

  const photosHtml = photoKeys
    .map((key) => {
      const [leadId, photoId] = key.split('/');
      const src = `/review/photo/${encodeURIComponent(leadId)}/${encodeURIComponent(photoId)}`;
      return `<a href="${src}" target="_blank" rel="noopener noreferrer" class="block">
        <img src="${src}" alt="Submitted property photo" class="w-full h-40 object-cover rounded-lg border border-stone-200 hover:opacity-90 transition-opacity">
      </a>`;
    })
    .join('');

  const categoriesHtml = CATEGORIES.map((cat) => categoryFieldset(cat, analysis[cat.key] || {})).join('');

  const canSend = lead.status === 'complete' && !lead.response_sent_at;
  const alreadySent = !!lead.response_sent_at;

  const body = `
    <a href="/review/" class="text-sm text-sage-dark hover:underline">&larr; Back to queue</a>

    <div class="flex items-start justify-between mt-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-stone-900">${escapeHtml(lead.name)}</h1>
        <p class="text-stone-500">${escapeHtml(lead.city)}</p>
        <p class="text-sm text-stone-500 mt-1">${escapeHtml(lead.email)} &middot; ${escapeHtml(lead.phone)}</p>
        <p class="text-xs text-stone-400 mt-1">Submitted ${escapeHtml(formatDate(lead.submitted_at))}</p>
      </div>
      <div>${statusBadge(lead.status)}</div>
    </div>

    ${lead.notes ? `<p class="mb-6 text-sm text-stone-700 bg-stone-50 border border-stone-200 rounded-lg p-4"><strong>Homeowner notes:</strong> ${escapeHtml(lead.notes)}</p>` : ''}

    <h2 class="text-lg font-bold text-stone-900 mb-3">Photos</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">${photosHtml || '<p class="text-stone-500 text-sm">No photos.</p>'}</div>

    <form method="POST" id="review-form">
      <h2 class="text-lg font-bold text-stone-900 mb-3">Analysis</h2>
      <div class="space-y-6 mb-8">${categoriesHtml}</div>

      <h2 class="text-lg font-bold text-stone-900 mb-3">Finish</h2>
      <div class="space-y-4 mb-8">
        <div>
          <label class="block text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">Overall Assessment</label>
          <textarea name="overall_assessment" rows="3" class="w-full border border-stone-300 rounded px-3 py-2 text-sm">${escapeHtml(lead.overall_assessment || '')}</textarea>
        </div>
        <div>
          <label class="block text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">Top Priorities</label>
          <textarea name="top_priorities" rows="3" class="w-full border border-stone-300 rounded px-3 py-2 text-sm">${escapeHtml(lead.top_priorities || '')}</textarea>
        </div>
        <div>
          <label class="block text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">Recommended Next Steps</label>
          <textarea name="recommended_next_steps" rows="3" class="w-full border border-stone-300 rounded px-3 py-2 text-sm">${escapeHtml(lead.recommended_next_steps || '')}</textarea>
        </div>
        <div>
          <label class="block text-xs uppercase tracking-wide font-bold text-stone-500 mb-1">Homeowner Response</label>
          <textarea name="homeowner_response" rows="6" class="w-full border border-stone-300 rounded px-3 py-2 text-sm">${escapeHtml(lead.homeowner_response || '')}</textarea>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button type="submit" formaction="/review/lead/${escapeAttr(lead.id)}/save-draft" class="bg-stone-200 text-stone-900 px-4 py-2 rounded text-sm font-semibold hover:bg-stone-300">Save Draft</button>
        <button type="submit" formaction="/review/lead/${escapeAttr(lead.id)}/complete" class="bg-sage-default text-white px-4 py-2 rounded text-sm font-semibold hover:bg-sage-dark">Mark Complete</button>
      </div>
    </form>

    <div class="mt-6 pt-6 border-t border-stone-200">
      ${
        alreadySent
          ? `<p class="text-sm text-stone-600">Sent to homeowner ${escapeHtml(formatDate(lead.response_sent_at))}. <a href="#sent-body" class="text-sage-dark hover:underline">View sent content</a></p>
             <pre id="sent-body" class="mt-2 text-xs bg-stone-50 border border-stone-200 rounded p-3 whitespace-pre-wrap">${escapeHtml(lead.response_sent_body || '')}</pre>`
          : canSend
            ? `<form method="POST" action="/review/lead/${escapeAttr(lead.id)}/send"><button type="submit" class="bg-terracotta text-white px-4 py-2 rounded text-sm font-semibold hover:opacity-90">Send to Homeowner</button></form>`
            : `<p class="text-sm text-stone-400">Mark the lead Complete before it can be sent to the homeowner.</p>`
      }
    </div>

    <div class="mt-6 pt-6 border-t border-stone-200">
      <h2 class="text-lg font-bold text-stone-900 mb-3">Follow-up</h2>
      <form method="POST" action="/review/lead/${escapeAttr(lead.id)}/follow-up" class="space-y-3">
        <select name="status" class="border border-stone-300 rounded px-3 py-2 text-sm">
          <option value="follow_up" ${lead.status === 'follow_up' ? 'selected' : ''}>Follow-up</option>
          <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
        <textarea name="follow_up_notes" rows="2" placeholder="Follow-up notes / outcome" class="w-full border border-stone-300 rounded px-3 py-2 text-sm">${escapeHtml(lead.follow_up_notes || '')}</textarea>
        <button type="submit" class="bg-stone-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-stone-900">Update Status</button>
      </form>
    </div>
  `;

  return htmlResponse(pageShell(`${lead.name} — Photo Check`, body));
}

function categoryFieldset(cat, data) {
  const f = (key) => (data && data[key]) || '';
  return `
    <fieldset class="border border-stone-200 rounded-lg p-4">
      <legend class="text-sm font-bold text-stone-900 px-1">${escapeHtml(cat.label)}</legend>
      <div class="grid sm:grid-cols-3 gap-3 mt-2">
        ${selectField(cat.key, 'status', 'Status', f('status'), ['', 'OK', 'Needs Attention', 'Critical'])}
        ${selectField(cat.key, 'risk', 'Risk', f('risk'), ['', 'Low', 'Medium', 'High'])}
        ${selectField(cat.key, 'priority', 'Priority', f('priority'), ['', 'Low', 'Medium', 'High'])}
      </div>
      <div class="grid sm:grid-cols-2 gap-3 mt-3">
        ${textareaField(cat.key, 'observation', 'Observation', f('observation'))}
        ${textareaField(cat.key, 'recommended_action', 'Recommended Action', f('recommended_action'))}
        ${textareaField(cat.key, 'zone0_applicability', 'Zone 0 Applicability', f('zone0_applicability'))}
        ${textareaField(cat.key, 'how_zone0_can_help', 'How Zone 0 Can Help', f('how_zone0_can_help'))}
      </div>
    </fieldset>`;
}

function selectField(catKey, fieldKey, label, value, options) {
  const name = `cat__${catKey}__${fieldKey}`;
  const opts = options
    .map((o) => `<option value="${escapeAttr(o)}" ${o === value ? 'selected' : ''}>${o || '—'}</option>`)
    .join('');
  return `<div>
    <label class="block text-[10px] uppercase tracking-wide font-bold text-stone-500 mb-1">${escapeHtml(label)}</label>
    <select name="${name}" class="w-full border border-stone-300 rounded px-2 py-1.5 text-sm">${opts}</select>
  </div>`;
}

function textareaField(catKey, fieldKey, label, value) {
  const name = `cat__${catKey}__${fieldKey}`;
  return `<div>
    <label class="block text-[10px] uppercase tracking-wide font-bold text-stone-500 mb-1">${escapeHtml(label)}</label>
    <textarea name="${name}" rows="2" class="w-full border border-stone-300 rounded px-2 py-1.5 text-sm">${escapeHtml(value)}</textarea>
  </div>`;
}

async function handlePhoto(env, leadId, photoId) {
  const key = `${leadId}/${photoId}`;
  const obj = await env.PHOTO_BUCKET.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  return new Response(obj.body, {
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

async function handleSaveDraft(request, env, id) {
  const form = await request.formData();
  const analysis = collectAnalysis(form);

  const lead = await env.DB.prepare(`SELECT status FROM leads WHERE id = ?`).bind(id).first();
  if (!lead) return new Response('Lead not found', { status: 404 });

  const nextStatus = lead.status === 'new' ? 'in_review' : lead.status;

  await env.DB.prepare(
    `UPDATE leads SET analysis_json = ?, overall_assessment = ?, top_priorities = ?,
     recommended_next_steps = ?, homeowner_response = ?, status = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      JSON.stringify(analysis),
      field(form, 'overall_assessment'),
      field(form, 'top_priorities'),
      field(form, 'recommended_next_steps'),
      field(form, 'homeowner_response'),
      nextStatus,
      Date.now(),
      id
    )
    .run();

  return redirect(`/review/lead/${id}`);
}

async function handleComplete(request, env, id) {
  const form = await request.formData();
  const analysis = collectAnalysis(form);
  const overallAssessment = field(form, 'overall_assessment');

  if (!overallAssessment) {
    return htmlResponse(
      pageShell('Cannot complete', `<p class="text-zone-red">Overall Assessment is required before marking a lead complete. <a href="/review/lead/${escapeAttr(id)}" class="underline">Go back</a>.</p>`),
      400
    );
  }

  await env.DB.prepare(
    `UPDATE leads SET analysis_json = ?, overall_assessment = ?, top_priorities = ?,
     recommended_next_steps = ?, homeowner_response = ?, status = 'complete', updated_at = ?
     WHERE id = ?`
  )
    .bind(
      JSON.stringify(analysis),
      overallAssessment,
      field(form, 'top_priorities'),
      field(form, 'recommended_next_steps'),
      field(form, 'homeowner_response'),
      Date.now(),
      id
    )
    .run();

  return redirect(`/review/lead/${id}`);
}

async function handleSend(request, env, id) {
  const lead = await env.DB.prepare(`SELECT * FROM leads WHERE id = ?`).bind(id).first();
  if (!lead) return new Response('Lead not found', { status: 404 });

  if (lead.response_sent_at) {
    // Already sent -- refuse to send a homeowner the same response twice.
    return redirect(`/review/lead/${id}`);
  }
  if (lead.status !== 'complete') {
    return htmlResponse(pageShell('Cannot send', `<p class="text-zone-red">Mark the lead Complete before sending. <a href="/review/lead/${escapeAttr(id)}" class="underline">Go back</a>.</p>`), 400);
  }
  if (!lead.homeowner_response) {
    return htmlResponse(pageShell('Cannot send', `<p class="text-zone-red">Homeowner Response is empty. <a href="/review/lead/${escapeAttr(id)}" class="underline">Go back</a>.</p>`), 400);
  }

  let resendId;
  try {
    resendId = await sendHomeownerResponse(env, lead);
  } catch (e) {
    return htmlResponse(pageShell('Send failed', `<p class="text-zone-red">Sending failed: ${escapeHtml(e.message)}. Nothing was recorded as sent -- you can try again.</p>`), 502);
  }

  await env.DB.prepare(
    `UPDATE leads SET response_sent_at = ?, response_sent_body = ?, response_resend_id = ?, updated_at = ? WHERE id = ?`
  )
    .bind(Date.now(), lead.homeowner_response, resendId, Date.now(), id)
    .run();

  return redirect(`/review/lead/${id}`);
}

async function handleFollowUp(request, env, id) {
  const form = await request.formData();
  const status = field(form, 'status');
  if (!['follow_up', 'closed'].includes(status)) {
    return new Response('Invalid status', { status: 400 });
  }

  await env.DB.prepare(`UPDATE leads SET status = ?, follow_up_notes = ?, outcome = ?, updated_at = ? WHERE id = ?`)
    .bind(status, field(form, 'follow_up_notes'), status === 'closed' ? field(form, 'follow_up_notes') : null, Date.now(), id)
    .run();

  return redirect(`/review/lead/${id}`);
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

async function sendHomeownerResponse(env, lead) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: lead.email,
      reply_to: env.FROM_EMAIL,
      subject: `Your Zone 0 Photo Check results — ${lead.city}`,
      text: lead.homeowner_response,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Resend API error: ${res.status}`);
  }
  return data.id || null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectAnalysis(form) {
  const analysis = {};
  for (const cat of CATEGORIES) {
    analysis[cat.key] = {
      status: field(form, `cat__${cat.key}__status`),
      observation: field(form, `cat__${cat.key}__observation`),
      risk: field(form, `cat__${cat.key}__risk`),
      priority: field(form, `cat__${cat.key}__priority`),
      recommended_action: field(form, `cat__${cat.key}__recommended_action`),
      zone0_applicability: field(form, `cat__${cat.key}__zone0_applicability`),
      how_zone0_can_help: field(form, `cat__${cat.key}__how_zone0_can_help`),
    };
  }
  return analysis;
}

function field(form, key) {
  return (form.get(key) || '').toString().trim();
}

function formatDate(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function statusBadge(status) {
  const colors = {
    new: 'bg-stone-200 text-stone-800',
    in_review: 'bg-zone-amber/20 text-zone-amberdark',
    complete: 'bg-zone-green/20 text-zone-green',
    follow_up: 'bg-sage-default/20 text-sage-dark',
    closed: 'bg-stone-100 text-stone-500',
  };
  const cls = colors[status] || 'bg-stone-200 text-stone-800';
  return `<span class="inline-block px-2 py-1 rounded-full text-xs font-semibold ${cls}">${escapeHtml(STATUS_LABELS[status] || status)}</span>`;
}

function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function redirect(location) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

function htmlResponse(body, status) {
  return new Response(body, { status: status || 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function pageShell(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: { extend: { colors: {
      sage: { default: '#6B7A64', dark: '#4A5744', light: '#8A9A83' },
      terracotta: '#E06D53',
      zone: { red: '#c0492f', amber: '#b7791f', amberdark: '#92600c', green: '#2f855a' },
    } } }
  }
</script>
</head>
<body class="bg-stone-50 text-stone-900 font-sans">
  <div class="max-w-4xl mx-auto px-6 py-10">
    ${body}
  </div>
</body>
</html>`;
}
