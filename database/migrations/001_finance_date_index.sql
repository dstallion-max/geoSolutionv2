-- Finance already uses transaction_date in the application. This migration
-- makes the date filter explicit without replacing existing finance rows.
ALTER TABLE public.finance
    ADD COLUMN IF NOT EXISTS transaction_date date;

-- Legacy rows without a date retain their creation day where available.
UPDATE public.finance
SET transaction_date = COALESCE(transaction_date, created_at::date, CURRENT_DATE)
WHERE transaction_date IS NULL;

ALTER TABLE public.finance
    ALTER COLUMN transaction_date SET DEFAULT CURRENT_DATE,
    ALTER COLUMN transaction_date SET NOT NULL;

CREATE INDEX IF NOT EXISTS finance_transaction_date_idx
    ON public.finance (transaction_date);