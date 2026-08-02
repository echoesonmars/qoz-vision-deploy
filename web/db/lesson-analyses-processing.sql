alter table public.lesson_analyses
  drop constraint if exists lesson_analyses_status_check;

alter table public.lesson_analyses
  add constraint lesson_analyses_status_check check (
    status in ('pending', 'processing', 'ready', 'failed')
  );
