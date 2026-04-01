-- CreateTable
CREATE TABLE "public"."TrackerSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedDomain" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackerSession_pkey" PRIMARY KEY ("id")
);
