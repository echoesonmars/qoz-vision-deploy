alter table public.incidents
  add column if not exists analysis_status text not null default 'processing';

alter table public.incidents
  add column if not exists error_message text;

alter table public.incidents
  drop constraint if exists incidents_analysis_status_check;

alter table public.incidents
  add constraint incidents_analysis_status_check check (
    analysis_status in ('processing', 'failed', 'completed')
  );

update public.incidents
set analysis_status = 'completed'
where category <> 'pending';

update public.incidents
set
  analysis_status = 'failed',
  error_message = coalesce(error_message, 'Анализ не был завершён. Нажмите «Повторить».')
where category = 'pending';

create index if not exists incidents_analysis_status_idx
  on public.incidents (analysis_status);
