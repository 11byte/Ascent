-- CreateTable
CREATE TABLE "public"."GithubEvent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogEvent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillEvent" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GithubEvent_userId_idx" ON "public"."GithubEvent"("userId");

-- CreateIndex
CREATE INDEX "BlogEvent_userId_idx" ON "public"."BlogEvent"("userId");

-- CreateIndex
CREATE INDEX "SkillEvent_userId_idx" ON "public"."SkillEvent"("userId");
