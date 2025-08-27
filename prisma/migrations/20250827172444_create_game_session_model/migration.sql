/*
  Warnings:

  - You are about to drop the column `endedAt` on the `Leaderboard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Leaderboard" DROP COLUMN "endedAt";

-- CreateTable
CREATE TABLE "public"."GameSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_userId_key" ON "public"."GameSession"("userId");

-- AddForeignKey
ALTER TABLE "public"."GameSession" ADD CONSTRAINT "GameSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
