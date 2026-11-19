-- Incident I-018: an out-of-band storage policy allowed any authenticated user
-- to upload into any fund's receipts folder. It was removed in production via
-- the SQL editor (approved by Nono). This migration records that
-- removal so a rebuilt or other environment cannot keep or reintroduce it.
--
-- Receipt uploads remain governed by receipts_insert_manager (own user folder
-- plus the fund's record_expenses permission). Safe to re-run.
drop policy if exists "Authenticated users can upload receipts" on storage.objects;
