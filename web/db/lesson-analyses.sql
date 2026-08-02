create table if not exists public.lesson_analyses (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'ready', 'failed')),
  storage_path text not null,
  title text,
  detected_language text check (detected_language in ('kk', 'ru', 'en')),
  analysis jsonb,
  error_message text,
  source_live_session_id uuid references public.live_monitor_sessions (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lesson_analyses_created_at_idx on public.lesson_analyses (created_at desc);
create index if not exists lesson_analyses_status_idx on public.lesson_analyses (status);
