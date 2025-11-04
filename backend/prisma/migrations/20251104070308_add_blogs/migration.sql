/*
  Warnings:

  - The `topic` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."BlogDomain" AS ENUM ('AI', 'ML', 'Cyber', 'DevOps', 'Blockchain', 'Cloud', 'General');

-- AlterTable
ALTER TABLE "public"."Blog" DROP COLUMN "topic",
ADD COLUMN     "topic" "public"."BlogDomain" NOT NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updatedAt" DROP DEFAULT;
