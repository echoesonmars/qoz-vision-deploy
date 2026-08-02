create table if not exists public.cameras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_name text not null default '',
  vendor text not null check (vendor in ('dahua', 'hikvision', 'custom')),
  nvr_address text not null,
  nvr_port int not null default 554,
  username text not null,
  password text not null,
  channel int not null,
  stream_profile text not null default 'main'
    check (stream_profile in ('main', 'sub')),
  transcode_to_h264 boolean not null default false,
  rtsp_url_override text,
  device_type text not null default 'XVR',
  serial_no text not null default '',
  equipment_id text not null,
  is_enabled boolean not null default true,
  sort_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (equipment_id, channel)
);

create index if not exists cameras_org_idx on public.cameras (organization_name);
create index if not exists cameras_enabled_idx on public.cameras (is_enabled);
