/*
  Warnings:

  - You are about to drop the column `ImageSrc` on the `Character` table. All the data in the column will be lost.
  - Added the required column `imageSrc` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Character" DROP COLUMN "ImageSrc",
ADD COLUMN     "imageSrc" TEXT NOT NULL;
