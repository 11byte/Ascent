/*
  Warnings:

  - You are about to drop the column `name` on the `Skill` table. All the data in the column will be lost.
  - Added the required column `category` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phase` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillName` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Skill" DROP COLUMN "name",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "phase" TEXT NOT NULL,
ADD COLUMN     "proofUrl" TEXT,
ADD COLUMN     "skillName" TEXT NOT NULL,
ADD COLUMN     "source" TEXT;
