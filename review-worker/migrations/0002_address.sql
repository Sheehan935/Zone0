-- The public form now collects a full property address instead of just a
-- city (see PROJECT-TRUTH.md, Photo Check redesign). Renaming in place
-- keeps any existing test rows intact rather than dropping/recreating the
-- table.
ALTER TABLE leads RENAME COLUMN city TO address;
