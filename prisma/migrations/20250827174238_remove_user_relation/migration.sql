/*
  Warnings:

  - You are about to drop the column `userId` on the `GameSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GameSession" DROP CONSTRAINT "GameSession_userId_fkey";

-- DropIndex
DROP INDEX "public"."GameSession_userId_key";

-- AlterTable
ALTER TABLE "public"."GameSession" DROP COLUMN "userId";
