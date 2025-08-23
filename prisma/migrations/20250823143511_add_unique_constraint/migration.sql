/*
  Warnings:

  - A unique constraint covering the columns `[difficulty]` on the table `Illustration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Illustration_difficulty_key" ON "public"."Illustration"("difficulty");
