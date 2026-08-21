CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  photo_keys TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','in_review','complete','follow_up','closed')),
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
  submitted_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_leads_submitted_at ON leads(submitted_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
