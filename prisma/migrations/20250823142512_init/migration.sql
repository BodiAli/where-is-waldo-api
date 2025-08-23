-- CreateTable
CREATE TABLE "public"."Illustration" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Illustration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "xStart" INTEGER NOT NULL,
    "yStart" INTEGER NOT NULL,
    "xEnd" INTEGER NOT NULL,
    "yEnd" INTEGER NOT NULL,
    "isFound" BOOLEAN NOT NULL DEFAULT false,
    "illustrationId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leaderboardId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Leaderboard" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_illustrationId_key" ON "public"."Character"("name", "illustrationId");

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_illustrationId_fkey" FOREIGN KEY ("illustrationId") REFERENCES "public"."Illustration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "public"."Leaderboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
