/*
  Warnings:

  - You are about to drop the column `userId` on the `BlogInteraction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BlogInteraction" DROP CONSTRAINT "BlogInteraction_userId_fkey";

-- AlterTable
ALTER TABLE "public"."BlogInteraction" DROP COLUMN "userId",
ADD COLUMN     "userRefId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."BlogInteraction" ADD CONSTRAINT "BlogInteraction_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "public"."User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
