/*
  Warnings:

  - The `Score` column on the `Leaderboard` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Leaderboard" DROP COLUMN "Score",
ADD COLUMN     "Score" INTEGER;
