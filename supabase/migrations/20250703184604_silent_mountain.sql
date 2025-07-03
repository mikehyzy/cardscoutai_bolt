-- Drop the existing prospects table if it exists
DROP TABLE IF EXISTS public.prospects;

-- Recreate the prospects table with aligned columns
CREATE TABLE public.prospects (
    rank            INTEGER      PRIMARY KEY,
    player          TEXT         NOT NULL,
    team            TEXT,
    age             INTEGER,
    highest_level   TEXT,
    position        TEXT,
    eta             INTEGER,
    fv              NUMERIC,
    ingested_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);