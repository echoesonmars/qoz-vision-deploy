create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'pending' check (
    category in (
      'pending',
      'fight',
      'weapon',
      'fall',
      'smoking',
      'phone_usage',
      'sleep',
      'lost_property',
      'crowd',
      'wanted_person',
      'fence_climbing',
      'anpr',
      'fire',
      'smoke',
      'intruder'
    )
  ),
  storage_path text not null,
  title text,
  camera_label text,
  description text,
  confidence numeric(5, 2),
  detected_categories jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists incidents_created_at_idx on public.incidents (created_at desc);
