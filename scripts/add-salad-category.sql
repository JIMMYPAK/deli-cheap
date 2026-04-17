DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'food_category'
      AND e.enumlabel = 'salad'
  ) THEN
    ALTER TYPE food_category ADD VALUE 'salad';
  END IF;
END $$;
