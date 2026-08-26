-- Tighten client write access on loyalty_points and appointments.
-- Neither table is written to by the app today (booking runs through the
-- Altegio proxy, not this schema), but the previous policies let any
-- authenticated user set arbitrary values on their own rows over the
-- REST API — e.g. self-granting loyalty points/tier, or flipping an
-- appointment's status/barber/time. All writes should happen server-side
-- with the service role, which bypasses RLS entirely.

-- loyalty_points: read-only for clients.
DROP POLICY IF EXISTS "System can upsert loyalty" ON loyalty_points;
DROP POLICY IF EXISTS "Users can update own loyalty" ON loyalty_points;

-- appointments: clients may still create their own appointment record and
-- cancel it, but may not rewrite any other field (status, barber, date/time).
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

REVOKE UPDATE ON appointments FROM authenticated;
GRANT UPDATE (status) ON appointments TO authenticated;

CREATE POLICY "Users can cancel own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = user_id AND status = 'upcoming')
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');
