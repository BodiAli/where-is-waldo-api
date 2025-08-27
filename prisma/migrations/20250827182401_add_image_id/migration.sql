/*
  Warnings:

  - Added the required column `imageId` to the `Illustration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Illustration" ADD COLUMN     "imageId" TEXT NOT NULL;
