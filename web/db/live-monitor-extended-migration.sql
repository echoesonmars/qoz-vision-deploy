alter table public.live_monitor_sessions
  add column if not exists recording_storage_path text,
  add column if not exists recording_duration_sec int,
  add column if not exists recording_bytes bigint,
  add column if not exists recording_upload_status text
    check (recording_upload_status is null or recording_upload_status in ('pending', 'uploading', 'ready', 'failed')),
  add column if not exists recording_uploaded_at timestamptz;

alter table public.live_incident_events
  add column if not exists evidence_storage_path text;

alter table public.lesson_analyses
  add column if not exists source_live_session_id uuid
    references public.live_monitor_sessions (id) on delete set null;

create index if not exists live_monitor_sessions_device_started_idx
  on public.live_monitor_sessions (device_id, started_at desc);

create index if not exists live_incident_events_session_captured_idx
  on public.live_incident_events (session_id, captured_at desc);
