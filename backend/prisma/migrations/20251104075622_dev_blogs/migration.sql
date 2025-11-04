-- CreateTable
CREATE TABLE "public"."BlogInteraction" (
    "id" SERIAL NOT NULL,
    "blogTitle" TEXT NOT NULL,
    "interested" BOOLEAN NOT NULL,
    "domain" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogInteraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BlogInteraction" ADD CONSTRAINT "BlogInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
