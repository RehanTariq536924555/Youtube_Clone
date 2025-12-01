-- Add isShort field to videos table
ALTER TABLE "videos" 
ADD COLUMN IF NOT EXISTS "isShort" boolean DEFAULT false;

-- Update existing short videos (60 seconds or less) to be marked as shorts
UPDATE "videos" 
SET "isShort" = true 
WHERE "duration" <= 60 AND "duration" IS NOT NULL;