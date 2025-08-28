/*
  Warnings:

  - You are about to drop the column `Score` on the `Leaderboard` table. All the data in the column will be lost.
  - Added the required column `Score` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Leaderboard" DROP COLUMN "Score";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "Score" INTEGER NOT NULL;
