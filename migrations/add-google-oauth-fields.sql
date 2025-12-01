-- Add Google OAuth fields to user table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "googleId" varchar,
ADD COLUMN IF NOT EXISTS "picture" varchar;

-- Make password nullable for Google OAuth users
ALTER TABLE "user" 
ALTER COLUMN "password" DROP NOT NULL;