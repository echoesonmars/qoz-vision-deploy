alter table public.incidents drop constraint if exists incidents_category_check;

update public.incidents set category = 'weapon' where category = 'safety';

alter table public.incidents
  add column if not exists description text,
  add column if not exists confidence numeric(5, 2);

alter table public.incidents
  add constraint incidents_category_check
  check (
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
  );
