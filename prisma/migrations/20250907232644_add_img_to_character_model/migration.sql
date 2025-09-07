/*
  Warnings:

  - You are about to drop the column `imageId` on the `Illustration` table. All the data in the column will be lost.
  - Added the required column `ImageSrc` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSrc` to the `Illustration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Character" ADD COLUMN     "ImageSrc" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Illustration" DROP COLUMN "imageId",
ADD COLUMN     "imageSrc" TEXT NOT NULL;
