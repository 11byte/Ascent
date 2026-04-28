-- AddForeignKey
ALTER TABLE "public"."TrackerSession" ADD CONSTRAINT "TrackerSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
