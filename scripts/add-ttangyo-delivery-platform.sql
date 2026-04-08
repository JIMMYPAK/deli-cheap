DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'delivery_platform'
      AND e.enumlabel = 'ttangyo'
  ) THEN
    ALTER TYPE delivery_platform ADD VALUE 'ttangyo';
  END IF;
END $$;
