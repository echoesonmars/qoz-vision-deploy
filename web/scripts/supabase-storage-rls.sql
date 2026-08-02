-- Supabase Dashboard → SQL → New query → Run
-- Бакет records: загрузка видео из демо (publishable/anon) только в incidents/ и lessons/

DROP POLICY IF EXISTS "qoz_demo_upload_incidents_lessons" ON storage.objects;

CREATE POLICY "qoz_demo_upload_incidents_lessons"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'records'
  AND (storage.foldername(name))[1] IN ('incidents', 'lessons')
);
