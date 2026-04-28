-- CreateTable
CREATE TABLE "public"."Macrothon" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "clubId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Macrothon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Macrothon" ADD CONSTRAINT "Macrothon_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "public"."Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
