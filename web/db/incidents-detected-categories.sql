alter table public.incidents
  add column if not exists detected_categories jsonb not null default '[]'::jsonb;
