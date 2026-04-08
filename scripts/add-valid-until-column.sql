ALTER TABLE discounts ADD COLUMN IF NOT EXISTS valid_until date;
CREATE INDEX IF NOT EXISTS idx_discounts_valid_until ON discounts(valid_until);
