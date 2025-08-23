/*
  Warnings:

  - A unique constraint covering the columns `[illustrationId]` on the table `Leaderboard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `illustrationId` to the `Leaderboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Leaderboard" ADD COLUMN     "illustrationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_illustrationId_key" ON "public"."Leaderboard"("illustrationId");

-- AddForeignKey
ALTER TABLE "public"."Leaderboard" ADD CONSTRAINT "Leaderboard_illustrationId_fkey" FOREIGN KEY ("illustrationId") REFERENCES "public"."Illustration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
