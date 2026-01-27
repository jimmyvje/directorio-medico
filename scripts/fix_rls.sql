-- Enable RLS on directory_listings if not already enabled
ALTER TABLE public.directory_listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid errors on re-run)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.directory_listings;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" ON public.directory_listings
FOR SELECT
USING (true);

-- TEST DATA: Set one standalone listing as verified so we can check the badge
UPDATE public.directory_listings
SET is_verified = true
WHERE consultorio_id IS NULL
AND id IN (
    SELECT id FROM public.directory_listings 
    WHERE consultorio_id IS NULL 
    LIMIT 1
);

-- TEST DATA: Ensure all listings are visible (sanity check update, optional)
-- Just ensuring we have some data
SELECT count(*) FROM public.directory_listings;
