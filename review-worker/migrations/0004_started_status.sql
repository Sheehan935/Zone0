-- Partial-lead capture (see PROJECT-TRUTH.md): the public form now saves
-- contact details as soon as step 1 is valid, before photos/concerns are
-- collected, so a visitor who drops off isn't lost. That partial row uses a
-- new 'started' status, which SQLite's CHECK constraint must allow -- and
-- CHECK constraints can't be altered in place, so this rebuilds the table
-- (same technique migration 0002/0003 would have needed for a CHECK change).
--
-- Also adds partial_notified_at, nullable: set once the scheduled sweep has
-- emailed the owner about an abandoned 'started' lead, so it's never resent.
CREATE TABLE leads_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  photo_keys TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('started','new','in_review','complete','follow_up','closed')),
  analysis_json TEXT,
  overall_assessment TEXT,
  top_priorities TEXT,
  recommended_next_steps TEXT,
  homeowner_response TEXT,
  response_sent_at INTEGER,
  response_sent_body TEXT,
  response_resend_id TEXT,
  follow_up_notes TEXT,
  outcome TEXT,
  areas TEXT,
  partial_notified_at INTEGER,
  submitted_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO leads_new (
  id, name, email, phone, address, notes, photo_keys, status,
  analysis_json, overall_assessment, top_priorities, recommended_next_steps,
  homeowner_response, response_sent_at, response_sent_body, response_resend_id,
  follow_up_notes, outcome, areas, partial_notified_at, submitted_at, updated_at
)
SELECT
  id, name, email, phone, address, notes, photo_keys, status,
  analysis_json, overall_assessment, top_priorities, recommended_next_steps,
  homeowner_response, response_sent_at, response_sent_body, response_resend_id,
  follow_up_notes, outcome, areas, NULL, submitted_at, updated_at
FROM leads;

DROP TABLE leads;
ALTER TABLE leads_new RENAME TO leads;

CREATE INDEX idx_leads_submitted_at ON leads(submitted_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
