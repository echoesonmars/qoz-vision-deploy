create table if not exists public.live_monitor_sessions (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  camera_id text,
  hls_url text not null,
  status text not null default 'running'
    check (status in ('running', 'stopped', 'error')),
  started_at timestamptz not null default now(),
  stopped_at timestamptz,
  frame_count int not null default 0,
  last_frame_at timestamptz,
  error_message text,
  recording_storage_path text,
  recording_duration_sec int,
  recording_bytes bigint,
  recording_upload_status text
    check (recording_upload_status is null or recording_upload_status in ('pending', 'uploading', 'ready', 'failed')),
  recording_uploaded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists live_monitor_sessions_device_status_idx
  on public.live_monitor_sessions (device_id, status);

create index if not exists live_monitor_sessions_started_at_idx
  on public.live_monitor_sessions (started_at desc);

create unique index if not exists live_monitor_sessions_one_running_per_device
  on public.live_monitor_sessions (device_id)
  where (status = 'running');

create table if not exists public.live_analysis_snapshots (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_monitor_sessions (id) on delete cascade,
  device_id text not null,
  captured_at timestamptz not null default now(),
  payload jsonb not null,
  engagement_score int,
  incident_count int not null default 0,
  session_offset_sec int
);

create index if not exists live_analysis_snapshots_session_captured_idx
  on public.live_analysis_snapshots (session_id, captured_at desc);

create index if not exists live_analysis_snapshots_device_captured_idx
  on public.live_analysis_snapshots (device_id, captured_at desc);

create table if not exists public.live_incident_events (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.live_analysis_snapshots (id) on delete cascade,
  session_id uuid not null references public.live_monitor_sessions (id) on delete cascade,
  device_id text not null,
  captured_at timestamptz not null,
  incident_type text not null,
  confidence text not null,
  location_context text,
  description text not null,
  timestamp_marker text,
  evidence_storage_path text
);

create index if not exists live_incident_events_device_captured_idx
  on public.live_incident_events (device_id, captured_at desc);

create index if not exists live_incident_events_session_idx
  on public.live_incident_events (session_id, captured_at desc);
