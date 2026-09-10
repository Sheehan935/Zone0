-- The $29 Detailed Photo Review intake adds an optional "areas of interest"
-- multi-select (see PROJECT-TRUTH.md, decision 1.7). Stored as a comma-joined
-- list of whitelisted slugs: zone0, plants, mulch, fence_deck, general, not_sure.
--
-- Additive and nullable on purpose: every lead submitted before this migration
-- reads back as NULL, and the review portal omits the row entirely for those
-- rather than inventing a value.
ALTER TABLE leads ADD COLUMN areas TEXT;
